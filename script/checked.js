$(document).ready(function(){
    $("input#c1").change(function(){
       	if($(this).prop("checked")){
       		$("input#c2").prop({"checked": false});
       	}else{
       		$("input#c2").prop({"checked": true});
       	}
    });
    $("input#c2").change(function(){
       	if($(this).prop("checked")){
       		$("input#c1").prop({"checked": false});
       	}else{
       		$("input#c1").prop({"checked": true});
       	}
    });
});