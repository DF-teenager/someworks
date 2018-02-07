<{extends file='h5/layout/main.tpl'}>

<{block name=common_css_link}><{/block}>

<{block name=local_css_link}> 
    <link rel="stylesheet" href="<{$g_resources_url}>/web/css/normalize.min.css">
    <link rel="stylesheet" href="<{$g_resources_url}>/weixin/style/jquery.fullpage.min.css">
    <link rel="stylesheet" href="<{$g_resources_url}>/weixin/style/animate.css" >
<{/block}>

<{block name=content}>
{{htmlCode}}
<{/block}>

<{block name=local_js_link}>
    <script type="text/javascript" src='<{$g_resources_url}>/weixin/js/jquery.fullpage.min.js'></script>
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

