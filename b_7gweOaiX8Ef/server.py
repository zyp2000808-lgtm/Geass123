import http.server
import socketserver
import os
import urllib.parse
import mimetypes

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 解码路径
        decoded_path = urllib.parse.unquote(self.path)
        print(f"请求路径: {self.path}")
        print(f"解码路径: {decoded_path}")
        
        # 检查请求的路径是否存在
        full_path = os.path.join(self.directory, decoded_path.lstrip('/'))
        print(f"完整路径: {full_path}")
        print(f"文件是否存在: {os.path.exists(full_path)}")
        print(f"目录是否存在: {os.path.isdir(full_path)}")
        print(f"当前工作目录: {os.getcwd()}")
        
        # 如果是视频文件，处理 range 请求
        if decoded_path.endswith(('.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv')):
            print("是视频文件，处理 range 请求")
            self._serve_video(full_path)
            return
        
        # 如果不是视频文件，检查是否存在
        if not os.path.exists(full_path):
            # 如果不存在，返回 index.html
            print("文件不存在，返回 index.html")
            self.path = '/index.html'
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'rb') as f:
                self.wfile.write(f.read())
            return
        return super().do_GET()
    
    def _serve_video(self, file_path):
        """处理视频文件的 range 请求"""
        if not os.path.exists(file_path):
            self.send_error(404, "File not found")
            return
        
        # 获取文件大小
        file_size = os.path.getsize(file_path)
        
        # 处理 range 请求
        range_header = self.headers.get('Range')
        if range_header:
            # 解析 range header
            try:
                range_str = range_header.split('=')[1]
                start, end = range_str.split('-')
                start = int(start)
                end = int(end) if end else file_size - 1
            except:
                start = 0
                end = file_size - 1
            
            # 发送 206 Partial Content
            self.send_response(206)
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(end - start + 1))
        else:
            # 发送 200 OK
            self.send_response(200)
            self.send_header('Content-Length', str(file_size))
        
        # 发送其他 headers
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type:
            self.send_header('Content-Type', mime_type)
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.end_headers()
        
        # 发送文件内容
        with open(file_path, 'rb') as f:
            f.seek(start)
            chunk_size = 8192
            remaining = end - start + 1
            while remaining > 0:
                chunk = f.read(min(chunk_size, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)

if __name__ == "__main__":
    PORT = 8080
    DIRECTORY = "dist"
    
    # 切换到 dist 目录
    os.chdir(DIRECTORY)
    
    # 创建服务器
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"服务器运行在 http://localhost:{PORT}")
        httpd.serve_forever()