import { history } from 'umi';
import { getAuthority } from '@/utils/authority';

const havePermission = () => {
  return getAuthority() != null;
};

export function render(oldRender) {
  if (havePermission() || history.location.pathname == '/login') { 
    oldRender();

  } else { 
    window.location.href = '/login';
  }
}
