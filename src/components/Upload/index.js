import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';

class UploadItem extends Component {
  state = { fileList: [], previewImage: null }

  componentDidMount() {
    const { onRef, dispatch, tokenTime } = this.props;
    if (onRef) onRef(this);
    const time = new Date();
    if (time.getTime() - tokenTime > 3000*1000) {
      dispatch({
        type: 'qiniu/token',
      });
    }
  }

  urls = () => {
    var urls = [];
    this.state.fileList.map((file) => {
      if (file.status === 'done' && file.response) {
        urls.push(file.response.key);
      }
    });
    return urls.length ? urls[0] : null;
  }

  handleCancel = () => this.setState({ previewImage: null })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
    });
  }

  beforeUpload = (file) => {
    const ispic = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!ispic) {
      message.error('请选择JPEG或PNG格式文件');
    }
    return ispic;
  }

  render() {
    const { fileList, previewImage } = this.state;
    const { limit, token, onChange } = this.props;
    const uploadButton = (
      <div>
        <UploadOutlined />
        <div>选择上传</div>
      </div>
    );
    return (
      <div>
        <Upload
          name='file'
          // accept='.png,.jpeg,.jpg'
          action='https://up-z2.qiniup.com/'
          listType='picture-card'
          data={{ token : token }}
          fileList={fileList}
          onChange={(info) => {
            const ispic = info.file.type === 'image/jpeg' || info.file.type === 'image/jpg' || info.file.type === 'image/png';
            if (ispic) {
              this.setState({ fileList: info.fileList })
              onChange && onChange(this.urls());
            }
          }}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= (limit == null ? 1 : limit) ? null : uploadButton}
        </Upload>
        <Modal visible={previewImage !== null} footer={null} onCancel={this.handleCancel}>
          <img alt='' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    token: state.qiniu.token,
    tokenTime: state.qiniu.tokenTime,
  };
}

export default connect(mapStateToProps)(UploadItem);