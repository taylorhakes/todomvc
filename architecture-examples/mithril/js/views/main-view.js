'use strict';
var app = app || {};

// View utility
app.watchInput = function (onInput, onenter, onescape) {
    return function (e) {
        onInput();
        if (e.keyCode == app.ENTER_KEY) {
            onenter();
        } else if (e.keyCode == app.ESC_KEY) {
            onescape();
        }
    }
};

app.view = function (ctrl) {
    return [
        m('header#header', [
            m('h1', 'todos'),
            m('input#new-todo[placeholder="What needs to be done?"]', {
                onkeyup: app.watchInput(
                    m.withAttr('value', ctrl.title),
                    ctrl.add.bind(ctrl),
                    ctrl.clearTitle.bind(ctrl)
                ),
                value: ctrl.title()
            })
        ]),
        m('section#main', {
            style: {
                display: ctrl.list.length ? '' : 'none'
            }
        },[
            m('input#toggle-all[type=checkbox]', {
                onclick: ctrl.completeAll.bind(ctrl),
                checked: ctrl.allCompleted()
            }),
            m('ul#todo-list', [
                ctrl.list.filter(ctrl.isVisible.bind(ctrl)).map(function(task, index) {
                    return m('li', { class: (function() {
                        var classes = '';
                        classes += task.completed() ? 'completed' : '';
                        classes += task.editing() ? 'editing' : '';
                        return classes;
                    })()
                    }, [
                        m('.view', [
                            m('input.toggle[type=checkbox]', {
                                onclick: m.withAttr('checked', ctrl.complete.bind(ctrl, task)),
                                checked: task.completed()
                            }),
                            m('label', {
                                ondblclick: ctrl.edit.bind(ctrl, task)
                            }, task.title()),
                            m('button.destroy', { onclick: ctrl.remove.bind(ctrl, index)})
                        ]),
                        m('input.edit', {
                            value: task.title(),
                            onkeyup: app.watchInput(
                                m.withAttr('value', task.title),
                                ctrl.doneEditing.bind(ctrl, task, index),
                                ctrl.cancelEditing.bind(ctrl, task)
                            ),
                            config: function(element) {
                                if (task.editing()) {
                                    element.focus();
                                }
                            },
                            onblur: ctrl.doneEditing.bind(ctrl, task, index)
                        })
                    ])
                })
            ])
        ]),
        ctrl.list.length == 0 ? '' : app.footer(ctrl)
    ];
};
