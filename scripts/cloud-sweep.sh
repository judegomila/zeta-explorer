#!/bin/bash
# Cloud sweep launcher — runs the imp-1136 BH-multipole plateau sweep on a
# remote EC2 instance. Permanently breaks the single-laptop O(N log N)
# ceiling by parallelizing across 64-192 cores.
#
# Usage:
#   ./scripts/cloud-sweep.sh launch              # launch + run + retrieve + terminate
#   ./scripts/cloud-sweep.sh status              # check running instance state
#   ./scripts/cloud-sweep.sh fetch <instance-id> # pull results back
#   ./scripts/cloud-sweep.sh terminate <id>      # kill
#
# Prereqs:
#   - aws CLI installed + `aws configure` done (access key, region)
#   - Default VPC with a public subnet (most accounts have one)
#   - Spot instance permissions (most accounts have this by default)
#
# Cost estimate (us-east-1 spot prices, may vary):
#   c7i.16xlarge  64 vCPUs  $0.50-1.00 /hr spot   (~1 hr sweep)
#   c7i.48xlarge  192 vCPUs $1.50-3.00 /hr spot   (~20 min sweep)
#   r7i.16xlarge  64 vCPUs  $0.70-1.40 /hr spot   (high-memory variant)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
INSTANCE_TYPE="${INSTANCE_TYPE:-c7i.16xlarge}"
REGION="${REGION:-us-east-1}"
AMI="${AMI:-ami-0e2c8caa4b6378d8c}"   # Amazon Linux 2023 in us-east-1 (update if region differs)
KEY_NAME="${KEY_NAME:-}"               # pre-existing EC2 key pair name (optional but recommended for SSH)
S3_BUCKET="${S3_BUCKET:-}"             # optional: results uploaded here if set

case "${1:-help}" in
  launch)
    if ! command -v aws >/dev/null 2>&1; then
      echo "ERROR: aws CLI not found. Install via: brew install awscli && aws configure"
      exit 1
    fi

    # Build user-data script that runs on the EC2 instance at boot
    USER_DATA=$(cat <<'USERDATA'
#!/bin/bash
set -uo pipefail
exec > /var/log/cloud-sweep-user-data.log 2>&1

# Install build tools
dnf install -y git curl gcc gcc-c++ make
curl --proto =https --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
source /root/.cargo/env

# Clone the repo (PUBLIC because no auth here — adjust if private)
cd /opt
git clone https://github.com/judegomila/mathexplorer.git
cd mathexplorer

# Build Rust release binary
cd rust/interval-rk4
cargo build --release --bin interval-rk4-cli
cd /opt/mathexplorer

# Install Node
dnf install -y nodejs

# Run the sweep (BH multipole, theta=0.1)
mkdir -p /opt/mathexplorer/scripts/logs
node scripts/imp-1136-bh-production-sweep.mjs \
  > /opt/mathexplorer/scripts/logs/cloud-sweep-$(date -u +%Y%m%d-%H%M).log 2>&1

# Upload results to S3 if bucket provided
if [ -n "${S3_BUCKET:-}" ]; then
  aws s3 cp /opt/mathexplorer/src/data/k-plateau-ladder-measured-2026-05.js \
    s3://${S3_BUCKET}/cloud-sweep-results/$(date -u +%Y%m%d-%H%M).js
  aws s3 cp /opt/mathexplorer/src/data/rust-port-sanity-sweep-2026-05-raw.json \
    s3://${S3_BUCKET}/cloud-sweep-results/$(date -u +%Y%m%d-%H%M)-raw.json
fi

# Self-terminate to stop the meter
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" -s)
INSTANCE_ID=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/instance-id)
aws ec2 terminate-instances --region $(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/placement/region) --instance-ids $INSTANCE_ID
USERDATA
)

    KEY_ARG=""
    if [ -n "$KEY_NAME" ]; then KEY_ARG="--key-name $KEY_NAME"; fi

    echo "Launching $INSTANCE_TYPE in $REGION..."
    INSTANCE_ID=$(aws ec2 run-instances \
      --region "$REGION" \
      --image-id "$AMI" \
      --instance-type "$INSTANCE_TYPE" \
      --user-data "$USER_DATA" \
      --instance-market-options 'MarketType=spot,SpotOptions={MaxPrice=2.00,InstanceInterruptionBehavior=terminate}' \
      --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=mathexplorer-sweep},{Key=Purpose,Value=bh-multipole-sweep}]' \
      $KEY_ARG \
      --query 'Instances[0].InstanceId' \
      --output text)

    echo "Instance launched: $INSTANCE_ID"
    echo "Tail user-data log via: aws ssm start-session --target $INSTANCE_ID --region $REGION"
    echo "Or: ssh ec2-user@<public-ip> -i ~/.ssh/$KEY_NAME.pem (if you set KEY_NAME)"
    echo "Instance will self-terminate when sweep completes."
    ;;
  status)
    aws ec2 describe-instances --region "$REGION" \
      --filters 'Name=tag:Purpose,Values=bh-multipole-sweep' 'Name=instance-state-name,Values=pending,running' \
      --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,LaunchTime]' \
      --output table
    ;;
  fetch)
    INSTANCE_ID="${2:-}"
    if [ -z "$INSTANCE_ID" ]; then echo "ERROR: usage: fetch <instance-id>"; exit 1; fi
    if [ -z "$S3_BUCKET" ]; then echo "ERROR: set S3_BUCKET env var"; exit 1; fi
    aws s3 sync "s3://${S3_BUCKET}/cloud-sweep-results/" "$PROJECT_DIR/scripts/logs/cloud-sweep-results/"
    ls -la "$PROJECT_DIR/scripts/logs/cloud-sweep-results/" | tail -10
    ;;
  terminate)
    INSTANCE_ID="${2:-}"
    if [ -z "$INSTANCE_ID" ]; then echo "ERROR: usage: terminate <instance-id>"; exit 1; fi
    aws ec2 terminate-instances --region "$REGION" --instance-ids "$INSTANCE_ID"
    ;;
  *)
    cat <<USAGE
Cloud sweep launcher for imp-1136 BH-multipole plateau sweep.

Usage:
  launch                  Launch EC2 spot instance, run sweep, self-terminate
  status                  List running sweep instances
  fetch <instance-id>     Pull results from S3
  terminate <id>          Kill an instance

Env vars (set before invocation):
  INSTANCE_TYPE  default c7i.16xlarge (~\$0.75/hr spot)
                 c7i.48xlarge (~\$2/hr) for the fastest sweep
  REGION         default us-east-1
  AMI            default Amazon Linux 2023 (us-east-1)
  KEY_NAME       optional EC2 key pair name for SSH
  S3_BUCKET      optional, where results upload

Prerequisites:
  brew install awscli
  aws configure   (one-time)

Expected cost per full sweep: \$0.50 - \$3.00 depending on instance type.
USAGE
    ;;
esac
