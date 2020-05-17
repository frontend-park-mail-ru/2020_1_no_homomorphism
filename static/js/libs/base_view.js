/**
 */
export default class BaseView {
    /**
     * @param {function} template
     */
    constructor(template) {
        this.template = template;
        this._data = {};
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
        this.root.innerHTML = this.template(this._data);
    }

    /**
     */
    get data() {
        return this._data;
    }

    /**
     * @param {Object} data
     */
    setData(data) {
        this._data = data;
    }
}
