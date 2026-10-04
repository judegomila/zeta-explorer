import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: '24px',
            border: '1px solid var(--series-2)',
            borderRadius: 8,
            background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
            marginTop: 16,
          }}
        >
          <h3 style={{ color: 'var(--series-2)', marginBottom: 8 }}>
            {this.props.title || 'Visualization Error'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
            {this.props.message ||
              'Something went wrong while rendering this visualization. You can try reloading it below.'}
          </p>
          {this.state.error && (
            <pre
              style={{
                fontSize: 12,
                color: 'var(--series-2)',
                background: 'color-mix(in srgb, var(--paper) 30%, transparent)',
                padding: '8px 12px',
                borderRadius: 4,
                overflowX: 'auto',
                marginBottom: 16,
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            className="filter-btn active"
            onClick={this.handleReset}
            aria-label="Reload visualization"
          >
            Reload Visualization
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
