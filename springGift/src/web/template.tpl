<{extends file='web/layout/event/main.tpl'}>

<{block name=content}>
{{htmlCode}}
<{/block}>

<{block name=local_js_link}>
<script src="<{$g_resources_url}>/web/js/perfect-scrollbar.min.js"></script>
<{/block}>

<{block name=local_js_block}>
<script type="text/javascript">
{{jsCode}}
</script>
<{/block}>

<{block name=local_css_block}>
<style>
{{cssCode}}
</style>
<{/block}>

<!-- 线上代码 http://118.190.126.206:8888/back-end/yindou_02/blob/master/application/views/web/events/2018/03/spring_gift.tpl -->