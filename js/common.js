$(function(){
   var zyf_v = _$z();
   zyf_v.init();
   var rule = {
       one:"a",
       another:"b",
       data:[["1,2","3,4,5","avoid"]]
   };
   zyf_v.add(new r(rule));
   zyf_v.init_rule();
   $("#sub").click(function () {
       console.log(zyf_v.serialize_format());
       return false;
   });
   zyf_v.deserialize({'a':'1','b':'2','c':'2,4','d':'1,3,5'});
   zyf_v.loadRules();
   //console.log(zyf_v.elements)
});