import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../config/environment.dart';

class ConsumerWebViewScreen extends StatefulWidget {
  const ConsumerWebViewScreen({super.key});

  @override
  State<ConsumerWebViewScreen> createState() => _ConsumerWebViewScreenState();
}

class _ConsumerWebViewScreenState extends State<ConsumerWebViewScreen> {
  late WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeWebView();
  }

  void _initializeWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            debugPrint('WebView 로딩 진행률: $progress%');
          },
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
            });
            debugPrint('페이지 로딩 시작: $url');
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
            debugPrint('페이지 로딩 완료: $url');
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('WebView 오류: ${error.description}');
            _showErrorDialog('페이지 로딩 중 오류가 발생했습니다: ${error.description}');
          },
        ),
      )
      ..loadRequest(Uri.parse(Environment.currentConsumerUrl));
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('오류'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _controller.reload();
              },
              child: const Text('다시 시도'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('취소'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Stack(
            children: [
              WebViewWidget(controller: _controller),
              if (_isLoading)
                const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 16),
                      Text('페이지 로딩 중...'),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
