initEditor();

/**
 * 初始化编辑器
 */
 function initEditor(){
     //初始化编辑器
     var editor = ace.edit("md-editor");

     editor.setTheme("ace/theme/monokai");   //设置主题样式
     editor.getSession().setMode("ace/mode/markdown");   //设置编辑器样式
     editor.getSession().setTabSize(4);     //设置Tab为4个空格
     editor.getSession().setUseWrapMode(true);    //自动换行

     //加载本地缓存数据
     editor.setValue(localStorage.localData || "");
     // 解析从本地加载的缓存数据
     // 并获取其返回的 viewer
     var viewer = parseMarkdown(editor);
     // 控制滚动条
    fixScrollBar(editor, viewer);

     // 绑定 change 事件
    // 即时解析 markdown
     editor.getSession().on("change",function(e){
         parseMarkdown(editor);
     });
 }

 /**
  * 解析markdown
  * @param {object} editor  编辑器
  * @return {object} 预览框
  */
 function parseMarkdown(editor){
     var viewer = $("#md-viewer");  //文档预览框
     var data = editor.getValue();  //获取编辑器数据
     //保存数据到本地
     localStorage.localData = data
    //解析 markdown
     data = marked(data);     
     viewer.html(data);
     //高亮 markdown 文档中的代码
     $("pre > code",viewer).each(function(){
         hljs.highlightBlock(this);
     });

     return viewer;
 }

 function fixScrollBar(editor,viewer){
     var session = editor.getSession();
     // 第一次加载页面时
    // 默认滚动到第一行
     session.setScrollTop(0);
     // 编辑器绑定滚动事件
     session.on("changeScrollTop",function(){
         var sTop = session.getScrollTop();
         // 设置预览框的滚动条
         viewer.scrollTop(sTop);
     });
     // 预览框定滚动事件
     viewer.on("scroll",function(){
         var sTop = viewer.scrollTop();
         // 设置编辑器的滚动条
         session.setScrollTop(sTop);
     });
 }