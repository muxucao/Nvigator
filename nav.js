/*!
 * =======================================================================================================
 * nav.js 导航设置脚本文件 ( 依赖jQuery )
 * =======================================================================================================
 *
 * 使用示例
 *
 * var nav = new Navigator('container-id', { levels: 3 });
 *
 * // 初始数据
 *
 */

var Navigator = function(elementId, opts) {
    this.container = $('#' + elementId);
    this.options = {
        // 允许最大层级
        levels: 3,
        // 出现错误时信息提示函数
        error: function(msg) {
            alert(msg);
        }
    };
    $.extend(this.options, opts);
};

/**
 * 添加菜单项
 * @param {HtmlElement} elParent 可选参数，如果提供该参数则添加为该元素的子菜单；不提供添加为顶级菜单
 * @param {JsonObject} jsonData 可选参数，菜单项初始值
 */
Navigator.prototype.add = function(elParent, jsonData) {

    var container = elParent || this.container,
        depth = elParent ? parseInt(container.parent().attr('data-depth'), 10) + 1 : 1,
        _this = this;

    var row = document.createElement('div');
    row.className = 'nav-row';

    // 链接名称文本框
    row.appendChild(this.create_input_cell('cell-nav-name', '导航名称', jsonData ? jsonData.name : ''));

    // 链接地址文本框
    row.appendChild(this.create_input_cell('cell-nav-url', '链接地址', jsonData ? jsonData.url : ''));

    // 新窗口复选框
    row.appendChild(this.create_select_cell('cell-new-window', jsonData ? jsonData.isNew : 0));


    // 操作按钮
    var cell_operation = document.createElement('div');
    cell_operation.className = 'fl cell-operation';

    // 添加子菜单按钮
    if (depth < this.options.levels) {
        cell_operation.appendChild(this.create_icon_button('btn-new', '添加子菜单', 'fa-plus-circle', function() {
            var parent = $(this).parent().parent();
            var sub_container = parent.next();
            if (sub_container.length == 0) {
                sub_container = $(_this.format('<div class="submenu depth-{0}"></div>', parseInt(parent.parent().attr('data-depth'), 10) + 1));
                parent.after(sub_container);
            }

            _this.add(sub_container);
        }));
    }

    // 上移按钮
    cell_operation.appendChild(this.create_icon_button('btn-move-up', '上移', 'fa-arrow-up', function() {
        var row = $(this).parent().parent().parent();
        var before = row.prev();
        if (before.length == 0) {
            return;
        }

        $(this).parent().parent().parent().remove();
        before.before(row);
    }));

    // 下移按钮
    cell_operation.appendChild(this.create_icon_button('btn-move-down', '下移', 'fa-arrow-down', function() {
        var row = $(this).parent().parent().parent();
        var next = row.next();
        if (next.length == 0) {
            return;
        }

        $(this).parent().parent().parent().remove();
        next.after(row);
    }));

    // 删除按钮
    cell_operation.appendChild(this.create_icon_button('btn-delete', '删除', 'fa-trash-o', function() {
        $(this).parent().parent().parent().remove();
    }));

    row.appendChild(cell_operation);

    var row_wraper = $(_this.format('<div data-depth="{0}"></div>', depth));

    // 如果包含子菜单
    if (jsonData && jsonData.items && jsonData.items.length > 0) {
        // 创建容器
        var sub_container = $(_this.format('<div class="submenu depth-{0}"></div>', depth + 1));
        container.append(row_wraper.append(row).append(sub_container));
        // 添加子菜单项
        _this.load_data(jsonData.items, sub_container);
    } else {
        container.append(row_wraper.append(row));
    }
};

Navigator.prototype.load_data = function(data, sub_container) {
    if (!data || data.length < 1) {
        return;
    }

    var _this = this;
    $(data).each(function() {
        _this.add(sub_container, this);
    });
};

/**
 * 获取菜单项结果
 */
Navigator.prototype.get_json_data = function() {
    var r = [];
    this.get_data(r, this.container);
    return r;
};

/**
 * 递归获取菜单项数据
 * @param {Array} r 用于存储结果的对象数组
 * @param {Element} container 容器元素
 */
Navigator.prototype.get_data = function(r, container) {
    var _this = this;
    container.children().each(function() {
        var items = $(this).children();
        var elName = items.eq(0).find('.cell-nav-name input');
        if ($.trim(elName.val()) == '') {
            return true;
        }

        var obj = {
            name: elName.val(),
            url: $.trim(items.eq(0).find('.cell-nav-url input').val()),
            isNew: items.eq(0).find('.cell-new-window select').val(),
            items: []
        };

        if (items.length == 2) {
            _this.get_data(obj.items, items.eq(1));
        }

        r.push(obj);
    });
};

/**
 * 创建图标按钮
 * @param {String} btnStyle 按钮样式名称
 * @param {String} btnText 按钮文字
 * @param {String} iconStyle 按钮样式名称，例：fa-trash-o
 * @param {Function} onClick 按钮点击事件
 * @return 按钮 Dom 元素
 */
Navigator.prototype.create_icon_button = function(btnStyle, btnText, iconStyle, onClick) {
    var link = document.createElement('a');
    var icon = document.createElement('i');
    var text = document.createTextNode(btnText);
    icon.className = 'fa ' + iconStyle;
    link.href = 'javascript:;';
    link.className = btnStyle;
    link.appendChild(icon);
    link.appendChild(text);
    link.onclick = onClick;
    return link;
};

/**
 * 创建文本框列
 * @param {String} cellStyle 单元格样式名
 * @param {String} inputPlaceholder 文本框placeholder
 * @param {String } defaultValue 文本框默认值
 */
Navigator.prototype.create_input_cell = function(cellStyle, inputPlaceholder, defaultValue) {
    var cell = document.createElement('div');
    var input = document.createElement('input');
    cell.className = 'fl ' + cellStyle;
    input.type = 'text';
    input.className = 'tb-discuz';
    input.placeholder = inputPlaceholder;
    cell.appendChild(input);

    if (defaultValue) {
        input.value = defaultValue;
    }

    return cell;
}

/**
 * 创建链接打开方式列
 * @param {String} cellStyle 列样式名
 * @param {String} defaultValue 默认选中项
 */
Navigator.prototype.create_select_cell = function(cellStyle, defaultValue) {
    var cell = document.createElement('div');
    var select = document.createElement('select');
    cell.className = 'fl ' + cellStyle;
    select.className = 'tb-discuz';
    select.options.add(new Option('本窗口打开', 0));
    select.options.add(new Option('新窗口打开', 1));
    cell.appendChild(select);

    if (defaultValue == 1) {
        select.value = defaultValue;
    }

    return cell;
};

/**
 * 错误信息提示函数
 */
Navigator.prototype.show_error = function(msg) {
    if ($.isFunction(this.options.error)) {
        this.options.error(msg);
    } else {
        alert(msg);
    }
};

/**
 * 字符串格式化函数
 */
Navigator.prototype.format = function() {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};


//module.exports = Navigator;
