/*
 * Copyright (C) 2018 Shanghai Pilelot Software Technology Co., Ltd.
 *
 * 本代码版权归上海派络软件科技有限公司所有，且受到相关的法律保护。
 * 没有经过版权所有者的书面同意，
 * 任何其他个人或组织均不得以任何形式将本文件或本文件的部分代码用于其他商业用途
 */

/**
 * 工具方法集合
 * Created by WeiWanrong on 2018/07/09.
 */
var Functions = {
    /** @namespace result.resultCode */

    /**
     * 计算项目中的url
     * @param url{string} 请求url
     * @returns {string} 计算后的url
     */
    url: function (url) {
        if (url.charAt(0) === "/") {
            url = CONTEXT_PATH + url;
        }
        return url;
    },
    /**
     * 根据result提示相关信息
     * @param result com.pilelot.yngr.common.Result
     */
    showResult: function (result) {
        if (result.resultCode > 0) {
            Functions.toastSuccess(result.message, result.messageDetail);
        } else {
            Functions.toastError(result.message, result.messageDetail)
        }
    },

    /**
     * 根据result.resultCode为错误时提示相关信息
     * @param result com.pilelot.yngr.common.Result
     */
    showErrorResult: function (result) {
        if (result.resultCode > 0) {
            return true;
        }

        Functions.toastError(result.message, result.messageDetail);
        return false;
    },

    /**
     * 基本信息提示框
     */
    toastInfo: function (message, messageDetail) {
        Functions.toast({
            icon: 'info',
            heading: message,
            text: messageDetail
        });
    },
    /**
     * 成功提示框
     */
    toastSuccess: function (message, messageDetail) {
        Functions.toast({
            icon: 'success',
            heading: message,
            text: messageDetail
        });
    },
    /**
     * 警告提示框
     */
    toastWarn: function (message, messageDetail) {
        Functions.toast({
            icon: 'warning',
            heading: message,
            text: messageDetail
        });
    },
    /**
     * 错误提示框
     */
    toastError: function (message, messageDetail) {
        Functions.toast({
            icon: 'error',
            heading: message,
            text: messageDetail,
            hideAfter: false
        });
    },

    /**
     * 提示框模型
     */
    toast: function (config) {
    	var $promptBox= $("#side-bar-tip").find(".prompt_box");
    	if($promptBox.length>0){
    		var $prevImg = $("#side-bar-tip").find(".static-img");//TODO 根据是否有消息获取当前的状态
    		$("#side-bar-tip").find(".tip-img").hide();
    		$("#side-bar-tip").find(".toast-img").show();
    		$promptBox.find(".message").text(config.heading);
    		$promptBox.show();
    		if(Functions.toast.timeoutId){
    			clearTimeout(Functions.toast.timeoutId);
    		}
    		
    		Functions.toast.timeoutId = setTimeout(showToat,3000);
    		
    		$promptBox.mouseover(function(){
				clearTimeout(Functions.toast.timeoutId);
			});
    		$promptBox.mouseout(function(){
    			Functions.toast.timeoutId = setTimeout(showToat,3000);
			});
			
			function showToat(){
    			$promptBox.hide();
        		$("#side-bar-tip").find(".tip-img").hide();
        		$prevImg.show();
			}
    	}
    	
    	/*if($(".prompt_box").length > 0){
    		var toastType = config.icon;
    		var $propmptBox =$('.prompt_box');
    		var message =  config.heading;
    		var imgUrl = "";
    		switch(toastType){
	    		case "success":
	    			imgUrl = Functions.url("/static/style/img/112.png");
	    			break;
	    		case "warning":
	    			imgUrl = Functions.url("/static/style/img/error.png");
	    			break;
	    			
	    		case "error":
	    			imgUrl = Functions.url("/static/style/img/error.png");
	    			break;
    		}
    		
    		$propmptBox.find(".message").text(message);
    		$propmptBox.find("context-img").attr("src", imgUrl);
    		
    		$propmptBox.fadeIn(200,function(){
				$(this).fadeOut(2500)
			})
		
			$propmptBox.mouseover(function(){
				$(this).stop().fadeIn(200)
			})
			$propmptBox.mouseout(function(){
				$(this).stop().fadeOut(2500)
			});
    	}*/
    	else {
    		if (config.text === null) {
                config.text = undefined;
            }
            var context = $.extend({}, {
                heading: '系统消息',
                position: 'top-right',
                loaderBg: '#ff6849',
                hideAfter: 3000
            }, config);
            $.toast(context);
    	}	  		   		  					
    },

    /**
     * 弹框
     */
    alert: function (config, callback) {
        var context = $.extend({}, {
            title: "系统提示",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: true
        }, config);
        callback = callback || function (isConfirm) {
        };
        swal(context, callback);
        var confirmContext = {
            close: function () {
                swal.close();
            }
        };
        return confirmContext;
    },

    /**
     * 删除确认框
     */
    confirmRemove: function (callback, config) {
        var context = $.extend({}, {
            title: "系统提示",
            text: "确定要删除数据吗？",
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: true
        }, config);
        return Functions.alert(context, callback);
    },

    /**
     * 默认构建一个json ajax
     * @param options {*} 扩展选项
     * @returns {*}
     */
    jsonAjax: function (options) {
        if (Object.prototype.hasOwnProperty.call(options, "url")) {
            var url = options.url;
            if (url !== undefined && url !== null) {
                options.url = Functions.url(options.url);
            }
        }
        return $.extend({
            data: JSON.stringify({}),
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            error: function (xMLHttpRequest, textStatus, errorThrown) {
                Functions.showErrorResult({
                    resultCode: 1,
                    message: "textStatus:" + textStatus + "<br/>" + "errorThrown:" + errorThrown
                });
            }
        }, options)
    },


    /**
     * 一个简单列定义实现
     * @param options{{smartColumns:[]}}
     */
    smartDataTableConfig: function (options) {
        options = this.dataTableConfig(options);

        if (options.url && !options.ajax) {
            options.ajax = Functions.jsonAjax({
                url: options.url,
                data: function (data, settings) {
                    var content = options.param(data, settings);
                    if (options.paging) {
                        content.pagination = {
                            page: data.start / data.length + 1,
                            length: data.length,
                            start: data.start
                        }
                    }
                    return JSON.stringify(content);
                },
                dataSrc: options.dataHandler || function (result) {
                    Functions.showErrorResult(result);
                    return result.resultData;
                }
            });
        }


        var smartColumns = options.smartColumns;
        if (smartColumns) {
            var columns = options.columns;
            var columnDefs = options.columnDefs;
            if (!columns) {
                columns = [];
                options.columns = columns;
            }
            if (!columnDefs) {
                columnDefs = [];
                options.columnDefs = columnDefs;
            }
            $.each(smartColumns, function (index, item) {
                if (!columns[index]) {
                    columns[index] = {};
                }
                if (typeof item === "string") {
                    if ($.isEmptyObject(columns[index])) {
                        if (item.slice(0, 1) === "|" && item.slice(item.length - 1) === "|") {
                            columnDefs[columnDefs.length] = {
                                targets: index,
                                data: function (row, type, val, meta) {
                                    return item.slice(1, item.length - 1);
                                }
                            };
                        } else {
                            columns[index] = {
                                data: item
                            };
                        }
                    }
                } else if (typeof item === "function") {
                    var hasDef = false;
                    $.each(columnDefs, function (i, ele) {
                        if (ele.targets === index) {
                            hasDef = true;
                            return false;
                        }
                    });
                    if (!hasDef) {
                        columnDefs[columnDefs.length] = {
                            targets: index,
                            data: item
                        };
                    }
                } else if (typeof item === "object") {
                    if ($.isEmptyObject(columns[index])) {
                        var column = {};
                        var count = 0;
                        for (var key in item) {
                            if (item.hasOwnProperty(key)) {
                                count++;
                                columns[index] = {
                                    data: key,
                                    render: item[key]
                                };
                            }
                        }

                        if (count !== 1) {
                            columns[index] = item;
                        }
                    }
                }
            });
        }

        return options;
    },

    /**
     * 构建一个默认的dataTable配置
     * @param options 配置选项
     * @return {*}
     */
    dataTableConfig: function (options) {
        return $.extend({}, {
            serverSide: true,
            paging: true,
            info: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            processing: false,
            language: {url: Functions.url("/static/js/zh_CN.json")}
        }, options);
    },

    /**
     * 日期时间格式化函数
     * @param options {{pattern string , date Date}}
     */
    formatDate: function (options) {
        options = $.extend({
            pattern: "yyyy-MM-dd",
            date: new Date()
        }, options);
        var date = options.date;
        if (typeof date === "number") {
            date = new Date(date);
        }
        var month = date.getMonth() + 1;
        var d = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var seconds = date.getSeconds();
        return options.pattern.replace("yyyy", date.getFullYear())
            .replace("yy", date.getYear())
            .replace("MM", month < 10 ? "0" + month : month)
            .replace("M", month)
            .replace("dd", d < 10 ? "0" + d : d)
            .replace("d", d)
            .replace("HH", hour < 10 ? "0" + hour : hour)
            .replace("H", hour)
            .replace("mm", minute < 10 ? "0" + minute : minute)
            .replace("m", minute)
            .replace("ss", seconds < 10 ? "0" + seconds : seconds)
            .replace("s", seconds);
    },

    /**
     * 导出数据
     * @param options
     */
    exportForm: function (options) {
        var $form = options.form;
        $form.attr("action", Functions.url(options.url))
            .attr("method", "post")
            .attr("target", "_blank")
            .trigger("submit")
            .removeAttr("action")
            .removeAttr("target");
    },

    /**
     * 从datable中获取$child所在行数据
     * @param dataTable dataTable对象
     * @param $child 行中子选项
     * @param isSubTable 是否子table
     */
    forkTableData: function (dataTable, $child, isSubTable) {
        var $row = $child.is("tr") ? $child : $child.parents("tr:first");
        if (isSubTable) {
            $row = $row.prev("tr");
        }
        return dataTable.row($row).data();
    },

    /**
     * 重新加载dataTable
     * @param dataTable 要加载的dataTable
     */
    reloadTable: function (dataTable) {
        dataTable.ajax.reload();
    },

    /**
     * 销毁dataTable
     * @param $dataTable jQuery table对象
     */
    destroyDataTable: function ($dataTable) {
        var childTable = $dataTable.dataTable().api();
        if (childTable) {
            childTable.destroy();
        }
        $dataTable.find("tbody").empty();
    },

    /**
     * 清空表单
     * @param $formContext 表单上下文
     */
    resetForm: function ($formContext) {
        $formContext.find("input:not(:button)").val(undefined);
        $formContext.find("textarea").val(undefined);
        $formContext.find(":checked").prop("checked", false);
        $formContext.find(":selected").prop("selected", false);
    }
};
