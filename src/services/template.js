import request from '../utils/request';

export function fetchTemplateList( { isPraise }) {
    return request('/api/templateList', {
        method: 'post',
        body: JSON.stringify({
            isPraise: isPraise
        })
    });
}

export function addTemplate( { currentAddTemplate }) {
    return request('/api/addTemplate', {
        method: 'post',
        body: JSON.stringify({
            currentAddTemplate: currentAddTemplate
        })
    });
}
