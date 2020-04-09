//获取左右箭头
 var leftArrow = document.getElementsByClassName("left-arrow")[0];
var rightArrow = document.getElementsByClassName("right-arrow")[0];

//获取头像框
var headPictures=document.getElementsByTagName("img");

//建立并填入头像数组（我知道很憨）
var headPosition=[];
for(var i=0;i<18;i++)
{
    headPosition[i] = "./headPicture/"+(i+1)+".jpg";
}

//点击左箭头切换头像
leftArrow.addEventListener('click', function () {
    var p = headPosition[0];
    for(var t=0;t<headPosition.length;t++)
    {
       headPosition[t]=headPosition[t+1];
    }
    headPosition[headPosition.length-1]=p;
    for(var i=0;i<5;i++)
    {
        headPictures[i].src = headPosition[i];
    }
});

//点击右箭头切换头像
rightArrow.addEventListener('click', function () {
    var p = headPosition[headPosition.length-1];
    for(var t= headPosition.length-1;t>0;t--)
    {
        headPosition[t]=headPosition[t-1];
    }
    headPosition[0]=p
    for(var i=0;i<5;i++)
    {
        headPictures[i].src = headPosition[i];
    }
});








