export default class BaseView {
    /**
     * @param {function} template
     */
    constructor(template) {
        this.template = template;
        this.data = {};
        this.root = '';
        this.url = '';
    }

    /** Рендеринг
     *  @param {Object} root
     *  @param {string} url
     */
    render(root, url = '') {
        this.url = url;
        this.root = root;
        this.root.innerHTML = this.template(this.data);
    }

    get getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }
}
