var Peredvishenie=false;//зажатая мыш
var tX = 0,tY = 0;//старие координати
var first=false;//первое зажатие
var maxY,minY=0,maxX,minX=0;//максимальние и минимальние значения координат
var animateTime = 120;//время анимации
var prosentSel = 120;//процент увеличения
var radok=13;//елементов в рядке
var stolbik=16;//елументов в столбике
var flagZoom = true;//Розрешение на зоом карти
var leftShowElementStart = 0,leftShowElementEnd = 0;
var topShowElementStart = 0,topShowElementEnd = 0;
var FirstZoom = true;
var minZoomWidthElement = 30, maxZoomWidthElement = 120;//минимальная ширина елемента карти при зуме

function getMouseCoords(mX,mY){
    //alert(event);
    //var mX = event.clientX;
    //var mY = event.clientY; 

    //$('#coordinat').html('x='+mX+' y='+mY);
    //alert(Peredvishenie);
    if(Peredvishenie){
        if(first){
            //$('#cod').html('tX='+tX+' mX='+mX);
            permeshenie(mX,mY,false);
            tX = mX;
            tY = mY;
        }else{
            tX = mX;
            tY = mY;
            first=true;
        }
    }

//    if(tX==)
}
function PeredvishenieTrue(){
    Peredvishenie = true;
}
function PeredvishenieFalse(){
    Peredvishenie = false;
    first=false;
    return false;
}
window.onmouseup = function(){
//    alert('hello');
    PeredvishenieFalse();
}
function permeshenie(mX,mY,animate){
//    alert('mX='+mX+' mY='+mY);
    var top_pos = parseInt($("#blokMaps").css("top"));
    var left_pos = parseInt($('#blokMaps').css('left'));
    cX = -1*(tX-mX);
    cY = -1*(tY-mY);
    rX = left_pos+cX;
    rY = top_pos+cY;
//    alert('rX='+rX+' rY='+rY);
    if(minY>=rY && rY>=maxY){
        if(animate){
            $('#blokMaps').animate({'top':rY+'px'},animateTime);
        }else{
            $('#blokMaps').css('top',rY+'px');
        }
        setTimeout(function(){
            chengBlockShowTop();
        }, 1);
    }

    if(minX>=rX && rX>=maxX){
        if(animate){
            $('#blokMaps').animate({'left':rX+'px'},animateTime);
        }else{
            $('#blokMaps').css('left',rX+'px');
        }
        setTimeout(function(){
            chengBlockShowLeft();
        }, 1);
    }


    //$('#cod').html('top='+top_pos+' left='+left_pos);
}

function ChekXY(procent){
    var widthALL = parseInt($('#blokMaps').css('width'));
    var heightALL = parseInt($('#blokMaps').css('height'));
    var widthBody = parseInt($('body').css('width'));
    var heightBody = parseInt($('body').css('height'));

    if(widthBody<widthALL){
        maxX = widthALL - widthBody;
        if(maxX<0) maxX = -1*widthBody;
        else maxX = -1*maxX;
    }else{
        maxX = 0;
    }

    if(heightALL>heightBody){
        maxY = heightALL - heightBody;
        if(maxY<0) maxY = -1*heightBody;
        else maxY = -1*maxY;
    }else{
        maxY = 0;
    }

    //alert('maxX='+maxX+' maxY='+maxY);
}

var kroc = 200;//крок
function mapTop(){
    permeshenie(tX,tY+kroc,true);
}
function mapBottom(){
    permeshenie(tX,tY-kroc,true);
}
function mapLeft(){
    permeshenie(tX-kroc,tY,true);
}
function mapRight(){
    permeshenie(tX+kroc,tY,true);
}

function SelMenu(id){//клик по пункту меню
    $('.fon_fixedMenu').toggleClass('fon_fixedMenu');
    document.getElementById('menu'+id).className='fon_fixedMenu';  
    
    $('.obekt').css('backgroundImage','url("/images/design/obekt.png")');
    $('.obekt').css('display','none');
    $('.obektNone'+id).css('display','block');
}
function SelObect(id){//Обект вибраний
    //alert('hello');
    $('.obekt').css('backgroundImage','url("/images/design/obekt.png")');
    $('#Obect'+id).css('backgroundImage','url("/images/design/obekt_sel.png")');
    opis=$('#OpisRealObekt'+id).html();
    $('#OpisObekt').html(opis);
    $('#OpisObekt').css('display','block');
}
function CloseOpis(){
    $('#OpisObekt').css('display','none');
    $('.obekt').css('backgroundImage','url("/images/design/obekt.png")');
}
var flagDown = true,flagUp = true;
function upMap(){
    if(flagUp) zoomMap(prosentSel+20);
    if(prosentSel+20>maxZoomWidthElement){
        flagUp = false;
        $('.up-key').css('background','rgba(59,52,2,0.5)');
    }
    flagDown = true;
    $('.down-key').css('background','none');
}
function downMap(){
    if(flagDown) zoomMap(prosentSel-20);
    if(prosentSel-20<minZoomWidthElement){
        flagDown = false;
        $('.down-key').css('background','rgba(59,52,2,0.5)');
    }
    flagUp = true;
    $('.up-key').css('background','none');
}

function zoomMap(procent){
//    alert('procent='+procent);
    if(prosentSel!=procent){
        if(FirstZoom){
            var widthBody = parseInt($('body').css('width'));
//            alert('widthBody='+widthBody+' stolbik='+stolbik);
            minZoomWidthElement = parseInt(widthBody/stolbik);
//            procent = minZoomWidthElement + 20;
//            alert(minZoomWidthElement);
            flagDown = false;
            $('.down-key').css('background','rgba(59,52,2,0.5)');
        }
        if(flagZoom){
            flagZoom = false;
            zoomElementMap(procent);

            var elementMap = $('#blokMaps');
            var widthALL = stolbik*procent;
            var heightALL = radok*procent;
            elementMap.css('width',widthALL + 'px');
            elementMap.css('height',heightALL + 'px');
            ChekXY();

            /*перемещение карти относительно екрана правильное маштабирование*/
            pereraxunokLeftTopMap(procent,elementMap,widthALL,heightALL);

            if(FirstZoom){
                showOblast();
                FirstZoom = false;
            }else{
                showOblastForZoom(procent);
            }
            prosentSel=procent;
            flagZoom = true;
        }
    }
}
function pereraxunokLeftTopMap(procent,elementMap,widthALL,heightALL){
    var kofi = procent/prosentSel;
    /*перерахунок правильних позицій карти по горизонталі*/
    var widthBody = parseInt($('body').css('width'));
    var left = parseInt(elementMap.css('left'));
    var left_real = 0;
    if(left<0){
        var widthBodyPolovina = parseInt(widthBody/2);
        var left_real = parseInt(left * kofi + (widthBodyPolovina - widthBodyPolovina * kofi));
    }
//    alert('do left=' + (left_real+widthALL) + ' widthBody='+widthBody);
    if(left_real+widthALL<widthBody){
        left_real = widthBody - widthALL;
    }
//    alert('posle left=' + (left_real+widthALL) + ' widthBody='+widthBody);
    if(left_real>0) left_real = 0;
//        alert('left='+left+' left_real='+left_real+'  kofi='+kofi);
    elementMap.css('left',left_real + 'px');

    /*перерахунок правильних позицій карти по вертикалі*/
    var heightBody = parseInt($('body').css('height'));
    var top = parseInt(elementMap.css('top'));
    var top_real = 0;
    if(top<0){
        var heightBodyPolovina = parseInt(heightBody/2);
        var top_real = parseInt(top * kofi + (heightBodyPolovina - heightBodyPolovina * kofi));
    }
    if(top_real+heightALL<heightBody){
        top_real = heightBody - heightALL;
    }
    if(top_real>0) top_real = 0;
    elementMap.css('top',top_real + 'px');

    /*перещот позиции елементов*/
    pereraxunokPoziciiElementov(kofi);
}

function pereraxunokPoziciiElementov(kifi){
    var len = $('.obekt').length;
    var left = 0,top = 0;
    for(var i=0;i<len;i++){
        element = $('.obekt:eq('+i+')');
        left = parseInt(element.css('left'));
        left = left * kifi;
        element.css('left',left+'px');

        top = parseInt(element.css('top'));
        top = top * kifi;
        element.css('top',top+'px');
    }
}

function showOblast(){
    var widthBody = parseInt($('body').css('width'));
    var widthElement = parseInt($('.DetMap').css('width'));
    stolbikShow = parseInt(widthBody/widthElement)+3;

    var heightBody = parseInt($('body').css('height'));
    var heightElement = parseInt($('.DetMap').css('height'));
    radokShow = parseInt(heightBody/heightElement)+3;
//    alert('radokShow='+radokShow+' stolbikShow='+stolbikShow+' widthElement='+widthElement);

    var left = Math.abs(parseInt($('#blokMaps').css('left')));
    leftShowElementEnd = -1 *left;
    leftShowElementStart = -1 * (left + widthElement);

    var top = Math.abs(parseInt($('#blokMaps').css('top')));
    topShowElementEnd = -1 * top;
    topShowElementStart = -1 * (top + heightElement);

    startStolbik = parseInt(left/widthElement) - 1;
    startRadok = parseInt(top/widthElement) - 1;
    //alert('left='+left+' top='+top+' startStolbik='+startStolbik+' startRadok='+startRadok);
    endStolbik = parseInt(startStolbik + stolbikShow);
    endRadok = parseInt(startRadok + radokShow);

    var name,img,element;
    var j,i;

    for(i=startRadok;i<endRadok;i++){
        for(j=startStolbik;j<endStolbik;j++){
            showImgElement(i,j);
        }
    }
}

function chengBlockShowTop(){
    var startRadokLocal = startRadok,radokShowLocal = radokShow;
    var startStolbikLocal = startStolbik,endStolbikLocal = endStolbik;
    var j,i;
    if(rY>topShowElementEnd){
        topShowElementEnd = topShowElementEnd + prosentSel;
        topShowElementStart = topShowElementStart + prosentSel;
        startRadok = startRadok - 1;
        endRadok = endRadok - 1;

        j = startRadokLocal + radokShowLocal - 1;
        for(i=startStolbikLocal;i<endStolbikLocal;i++){
            $('.radok' + j + '.stolbik' + i).css('backgroundImage','none');
        }
        j = startRadokLocal - 1;
        for(i=startStolbikLocal;i<endStolbikLocal;i++){
            showImgElement(j,i);
        }
        if(rY>topShowElementEnd) chengBlockShowTop();
    }else if(rY<topShowElementStart){
        topShowElementEnd = topShowElementEnd - prosentSel;
        topShowElementStart = topShowElementStart - prosentSel;
        startRadok = startRadok + 1;
        endRadok = endRadok + 1;

        j = startRadokLocal;
        for(i=startStolbikLocal;i<endStolbikLocal;i++){
            $('.radok' + j + '.stolbik' + i).css('backgroundImage','none');
        }
        j = startRadokLocal + radokShowLocal;
        for(i=startStolbikLocal;i<endStolbikLocal;i++){
            showImgElement(j,i);
        }
        if(rY<topShowElementStart) chengBlockShowTop();
    }
}

function chengBlockShowLeft(){
    var startRadokLocal = startRadok,endRadokLocal = endRadok;
    var startStolbikLocal = startStolbik,stolbikShowLocal = stolbikShow;
    var i,j;
    if(rX>leftShowElementEnd){
        leftShowElementEnd = leftShowElementEnd + prosentSel;
        leftShowElementStart = leftShowElementStart + prosentSel;
        startStolbik = startStolbik - 1;
        endStolbik = endStolbik - 1;

        i = startStolbikLocal + stolbikShowLocal - 1;
        for(j=startRadokLocal;j<endRadokLocal;j++){
            $('.radok' + j + '.stolbik' + i).css('backgroundImage','none');
        }
        i = startStolbikLocal - 1;
        for(j=startRadokLocal;j<endRadokLocal;j++){
            showImgElement(j,i);
        }
        if(rX>leftShowElementEnd) chengBlockShowLeft();
    }else{
        if(rX<leftShowElementStart){
            leftShowElementEnd = leftShowElementEnd - prosentSel;
            leftShowElementStart = leftShowElementStart - prosentSel;
            startStolbik = startStolbik + 1;
            endStolbik = endStolbik + 1;

            i = startStolbikLocal;
            for(j=startRadokLocal;j<endRadokLocal;j++){
                $('.radok' + j + '.stolbik' + i).css('backgroundImage','none');
            }
            i = startStolbikLocal + stolbikShowLocal;
            for(j=startRadokLocal;j<endRadokLocal;j++){
                showImgElement(j,i);
            }
            if(rX<leftShowElementStart) chengBlockShowLeft();
        }
    }
}

function zoomElementMap(procent){
    $('.DetMap').css('backgroundSize',procent+'px');
    var len = $('.DetMap').length;
    $('.DetMap').css('width',procent+'px');
    $('.DetMap').css('height',procent+'px');
    //alert(len);
    var top = 0,left,j;
    var element;
//            alert(procent);
    for(var i=0;i<radok;i++){
        left = 0;
        for(j=0;j<stolbik;j++){
            element = $('.radok' + i + '.stolbik' + j);
            element.css('top',top+'px');
            element.css('left',left+'px');
            left = left + procent;
        }
        top = top + procent;
    }
}

function showOblastForZoom(procent){
    var widthBody = parseInt($('body').css('width'));
    var widthElement = parseInt($('.DetMap').css('width'));
    stolbikShow = parseInt(widthBody/widthElement)+3;

    var heightBody = parseInt($('body').css('height'));
    var heightElement = parseInt($('.DetMap').css('height'));
    radokShow = parseInt(heightBody/heightElement)+3;
//    alert('radokShow='+radokShow+' stolbikShow='+stolbikShow+' widthElement='+widthElement);

    var left = Math.abs(parseInt($('#blokMaps').css('left')));
    leftShowElementEnd = -1 *left;
    leftShowElementStart = -1 * (left + widthElement);

    var top = Math.abs(parseInt($('#blokMaps').css('top')));
    topShowElementEnd = -1 * top;
    topShowElementStart = -1 * (top + heightElement);

    var startStolbikTmp = startStolbik;
    var startRadokTmp = startRadok;
    var endStolbikTmp = endStolbik;
    var endRadokTmp = endRadok;

    startStolbik = parseInt(left/widthElement) ;
    startRadok = parseInt(top/widthElement);
    endStolbik = parseInt(startStolbik + stolbikShow);
    endRadok = parseInt(startRadok + radokShow);

    var name,img,element;
    var j,i;
    if(procent>prosentSel){
        var check;
        for(i=startRadokTmp;i<endRadokTmp;i++){
            for(j=startStolbikTmp;j<endStolbikTmp;j++){
                element = $('.radok' + i + '.stolbik' + j);
                if(i<startRadok || i>endRadok || j<startStolbik || j>endStolbik){
                    element.css('backgroundImage','none');
                }else{
                    check = element.css('backgroundImage');
                    if(check=='none'){
                        name = element.attr('name');
                        img = '/images/design/map_small/' + name;
                        element.css('backgroundImage','url('+img+')');
                    }
                }
            }
        }
    }else{
        for(i=startRadok;i<endRadok;i++){
            for(j=startStolbik;j<endStolbik;j++){
                element = $('.radok' + i + '.stolbik' + j);
                if(i<=startRadokTmp || i>=endRadokTmp || j<=startStolbikTmp || j>=endStolbikTmp){
                    name = element.attr('name');
                    img = '/images/design/map_small/' + name;
                    element.css('backgroundImage','url('+img+')');
                }else{
                    check = element.css('backgroundImage');
                    if(check=='none'){
                        name = element.attr('name');
                        img = '/images/design/map_small/' + name;
                        element.css('backgroundImage','url('+img+')');
                    }
                }
            }
        }
    }
}


var arrayResize = [],arrayResizeTmp = [];
var multex = true;

function showImgElement(j,i){
    arrayResizeTmp.push(j);
    arrayResizeTmp.push(i);
    //$('#showText').append('<div>arrayResizeTmp[0]=' + arrayResizeTmp[0] + '</div>');
    pushResizeMasiveTMP();
}
function pushResizeMasiveTMP(){
    if(arrayResizeTmp!=''){
        if(multex){
            multex = false;
                arrayResize.push(arrayResizeTmp.shift());
                arrayResize.push(arrayResizeTmp.shift());
                pushResizeMasive();
            multex = true;
        }
        setTimeout("pushResizeMasiveTMP();",2);
    }
}
function pushResizeMasive(){
    if(arrayResize!=''){
        if(multex){
            multex = false;
            var j = arrayResize.shift();
            var i = arrayResize.shift();
            setTimeout("resizeElement("+j+","+i+");",2);
            multex = true;
        }
        setTimeout("pushResizeMasive();",2);
    }
}
function resizeElement(j,i){
    var element,name,img;
    element = $('.radok' + j + '.stolbik' + i);
    name = element.attr('name');
    img = '/images/design/map_small/' + name;
    element.css('backgroundImage','url('+img+')');
    //$('#showText').append('<div>j=' + j + ' i=' + i + '</div>');
}