import request from '../utils/request';

export function fetchTemplateList( { isPraise }) {
    return request('/api/templateList', {
        method: 'post',
        body: JSON.stringify({
            isPraise: isPraise
        })
    });
}
