
/**
 * 上线时拷贝dist目录下生成的样式，并在./template.tpl引入对应脚本
 */
import $ from 'jquery';
import 'fullpage.js';
import '../assets/web.scss';

/**
 * 开发JS,上线直接拷贝一下内容到./template.tpl
 */
var YD = YD || {};
YD.Template = function(){
    /** 变量 */
    this.$pagesNum = $('#pagesNum');
    this.$navPagerPrev = $('#navPagerPrev');
    this.$navPagerNext = $('#navPagerNext');
    this._anchorLinks=['section-01','section-02','section-03','section-04','section-05','section-06','section-07','section-08','section-09','section-10','section-11','section-12','section-13','section-14'];

    /** 初始化 */
    this.init = function(){
        var self = this;
        self.events();
        if ( !$( 'html' ).hasClass( 'fp-enabled' ) ) {
            $('#fullpage').fullpage({
                anchors: self._anchorLinks,
                navigation: true,
                navigationTooltips: ['年度报告', 'CEO寄语','2017大事记','交易数据','交易数据','盈利数据','项目数据','用户数据','用户数据','用户数据','平台福利','克拉礼遇','平台福利','感谢'],
                afterLoad: function(anchorLink,index){
    
                    var $el=$("."+anchorLink+" .animated");
                    
                    self.$pagesNum.text(index);
                    $el.each(function(i,item){
                        
                        var _data_an=$(item).attr("data-an");
                        var _data_delay=$(item).attr("data-delay");
                        $(item).css({"animation-delay":_data_delay+"s","-webkit-animation-delay":_data_delay+"s","-moz-animation-delay":_data_delay+"s","-ms-animation-delay":_data_delay+"s"}).addClass(_data_an).css("opacity","1");
                        item.id == "path_light" ? $(item).attr("class", "animated ringRotate") : null;
                    });
                    
                    if(index <= 1){
                        self.$navPagerPrev.css({'borderColor': '#82828f', 'cursor': 'not-allowed'});
                    }else if(index >= 14){
                        self.$navPagerNext.css({'borderColor': '#82828f', 'cursor': 'not-allowed'});
                    }else{
                        self.$navPagerPrev.css({'borderColor': '#fbfbfb', 'cursor': 'pointer'});
                        self.$navPagerNext.css({'borderColor': '#fbfbfb', 'cursor': 'pointer'});
                    }
                },
                onLeave:function(index,direction){
    
                    var $an_el=$(".animated");
                   
                    $an_el.each(function(j,item){
                        var _data_an=$(item).attr("data-an");
                        $(item).css("opacity","0").removeClass(_data_an);
                        item.id == "path_light" ? $(item).attr("class", "animated") : null;
                    });
                    
                }
            });
        }
    }

    this.events = function(){
        /** 事件方法 */
        var self = this;

        self.$navPagerPrev.click(function(){
            $.fn.fullpage.moveSectionUp();
        })
        self.$navPagerNext.click(function(){
            $.fn.fullpage.moveSectionDown();
        })
    }
}
var template = new YD.Template();
template.init();

/**
 * 热模块替换，开发环境使用
 */
if (module.hot) {
	module.hot.accept();
}