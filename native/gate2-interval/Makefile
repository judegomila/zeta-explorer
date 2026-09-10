CC = clang
BREW = /opt/homebrew
CFLAGS = -O2 -std=c11 -Wall -Wextra -I$(BREW)/include
LDFLAGS = -L$(BREW)/lib -lflint -lpthread -lm

cert_window: cert_window.c
	$(CC) $(CFLAGS) -o cert_window cert_window.c $(LDFLAGS)

selfcheck: cert_window
	./cert_window selfcheck 128

# validation against the dd evaluator (builds ../gate2-lane-a/gate2 if needed)
validate: cert_window
	$(MAKE) -C ../gate2-lane-a gate2
	python3 validate_against_dd.py

dryrun: cert_window
	nice -n 10 ./cert_window dryrun 128 128 6

# imp-95210 envelope-scale probe (dd, no FLINT; includes ../gate2-lane-a/main.c)
envprobe: envprobe.c ../gate2-lane-a/main.c
	$(CC) -O3 -std=c11 -Wall -Wextra -march=native -o envprobe envprobe.c -lpthread -lm

envscan: envprobe
	nice -n 16 ./envprobe scan 16 1536 0.004 8 95210 envprobe-scan-95210.json

# imp-95213 tier-P/B/S certifier (Taylor panels + alias ledger; includes cert_window.c)
tier_cert: tier_cert.c cert_window.c
	$(CC) $(CFLAGS) -o tier_cert tier_cert.c $(LDFLAGS)

tier-selfcheck: tier_cert
	nice -n 16 ./tier_cert selfcheck 128 80

tier-validate: tier_cert
	$(MAKE) -C ../gate2-lane-a gate2
	nice -n 16 ./tier_cert validate 30 95213 128 80
	nice -n 16 python3 tier_validate_dd.py

clean:
	rm -f cert_window envprobe tier_cert

.PHONY: selfcheck validate dryrun envscan tier-selfcheck tier-validate clean
