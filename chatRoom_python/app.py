import datetime
import flask
import redis

app = flask.Flask("python-SSE-chat")
app.secret_key = "python"

# 设置 redis 链接，使用 redis-py: https://github.com/andymccurdy/redis-py
r = redis.StrictRedis()

# 消息生成器
def event_stream() : 
    pubsub = r.pubsub()
    # 订阅'chat'频道
    pubsub.subscribe('chat')
    # 开始监听消息，如果有消息产生在返回消息
    for message in pubsub.listen():
        print message
        # Server-Send Event 的数据格式以'data:'开始
        yield 'data: %s\n\n' % message['data']

# 登陆函数，首次访问需要登陆
@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'POST':
        # 将用户信息记录到 session 中
        flask.session['user'] = flask.request.form['user']
        return flask.redirect('/')
    return '<form action="" method="post">user: <input name="user">'


# 接收 javascript post 过来的消息
@app.route('/post', methods=['POST'])
def post():
    message = flask.request.form['message']
    user = flask.session.get('user','anonymous')
    now = datetime.datetime.now().replace(microsecond=0).time()
    # 将消息发布到'chat'频道中
    r.publish('chat',u'[%s] %s: %s' % (now.isoformat(),user,message))
    return flask.Response(status = 204)


# 事件流接口
@app.route('/stream')
def stream():
    # 返回的类型是'text/event-stream'，否则浏览器不认为是 SSE 事件流
    return flask.Response(event_stream(),mimetype="text/event-stream")


@app.route('/')
def home():
    # 如果用户没有登陆的话，则强制登陆
    if 'user' not in flask.session:
        return flask.redirect('/login')
    return u"""
        <!doctype html>
        <title>chat</title>
        <script src="http://labfile.oss.aliyuncs.com/jquery/2.1.3/jquery.min.js"> </script>
        <style>body { max-width: 500px; margin: auto; padding: 1em; background: black; color: #fff; font: 16px/1.6 menlo, monospace; }</style>
        <p><b>hi, %s!</b></p>
        <p>Message: <input id="in" /></p>
        <pre id="out"></pre>
        <script>
            function sse() {
                // 接入服务器的事件流
                var source = new EventSource('/stream');
                var out = document.getElementById('out');
                source.onmessage = function(e) {
                    out.innerHTML =  e.data + '\\n' + out.innerHTML;
                };
            }
            // POST 消息到服务端
            $('#in').keyup(function(e){
                if (e.keyCode == 13) {
                    $.post('/post', {'message': $(this).val()});
                    $(this).val('');
                }
            });
            sse();
        </script>
        """ % flask.session['user']

if __name__ == '__main__':
    app.debug = True
    app.run()