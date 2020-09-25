import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import BraftEditor from 'braft-editor'
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';

class UploadItem extends Component {
  state = {
  }

  componentDidMount() {
    const { onRef, dispatch, tokenTime } = this.props;
    if (onRef) onRef(this);
    const time = new Date();
    if (time.getTime() - tokenTime > 3000 * 1000) {
      dispatch({
        type: 'qiniu/token',
      });
    }
  }

  uploadFn = (param) => {
    const serverURL = 'https://up-z2.qiniup.com/'
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    const successFn = (response) => {
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: 'http://picture.mineos.cn/' + JSON.parse(xhr.response).key,
        meta: {
          id: param.id,
          title: param.file.name,
          alt: '无法显示图片',
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
        }
      })
    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '图片上传失败'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    fd.append('token', this.props.token)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }

  render() {
    const { style, placeholder, onChange, value } = this.props;
    return (
      <BraftEditor
        style={style ? style : { borderStyle: 'solid', borderWidth: '1px', borderRadius: '2px', borderColor: '#d1d1d1' }}
        placeholder={placeholder}
        contentStyle={{ height: '26rem' }}
        onChange={onChange}
        media={{ uploadFn: this.uploadFn }}
        value={BraftEditor.createEditorState(value)}
      />
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