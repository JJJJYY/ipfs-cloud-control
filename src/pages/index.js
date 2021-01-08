import React, { Component } from 'react';

export default class Page extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          fontSize: '2.8rem',
          fontWeight: 'bold',
        }}
      >
        分布式云储存管理后台
      </div>
    );
  }
}
