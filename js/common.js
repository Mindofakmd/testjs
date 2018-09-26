let $1;
$1 = $(function () {
    var zyf_v = _$z();
    zyf_v.init();
    // zyf_v.add(new r({
    //     basic: true,
    //     one: 11>10,//可以放表达式
    //     another: "b",
    //     data: [["", "1,2", "avoid"]]
    // }));
    // var rule = {
    //     one: "a",
    //     another: "c",
    //     data: [["1,2", "1,2", "avoid"]]
    // };
    // var rule1 = {
    //     one: "b",
    //     another: "a",
    //     data: [["4", "2", "checked"]]
    // };
    //
    //
    // zyf_v.add(new r(rule));
    // zyf_v.add(new r(rule1));


    // zyf_v.add(new r({
    //     one: "c",
    //     another: "d",
    //     data: [["1", "1", "checked"], ["2", "2", "onlycheck"]]
    // }));

    // zyf_v.add(new r({
    //     one: "c",
    //     another: "f",
    //     data: [["5", "3", "onlycheck"]]
    // }));
    //
    // zyf_v.add(new r({
    //     one: "g",
    //     another: "c",
    //     data: [["1,2,3", "1", "avoid"]]
    // }));
    // zyf_v.add(new r({
    //     one: "d",
    //     another: "c",
    //     func: callback,
    //     data: [["1", "1", "if"]]
    // }));
    // zyf_v.add(new r({
    //     one: "d",
    //     another: "e",
    //     data: [["1", "", "disabled"]]
    // }));
    // zyf_v.add(new r({
    //     one: "d",
    //     another: "e",
    //     data: [["2", "", "enabled"]]
    // }));


    //zyf_v.add_order("a !null b required");
    //zyf_v.add_order("c required");

    //zyf_v.check_order(f_z);
    var zzz = true;
    function f_z(key) {
        if(zzz)
            alert(key);
        zzz = false;
    }


    //
    // function callback(key){
    //     if(zzz)
    //         alert(key);
    //     zzz = false;
    // }
    zyf_v.add_order("a is 1 b exclude 1,2")
    zyf_v.init_rule();
    $("#f").change(function(){
        alert(1);
    });
    $("#sub").click(function () {
        console.log()
        //zyf_v.check_order(f_z);
        //console.log(zyf_v.serialize_format());
        zyf_v.check_order(f_z);
        return false;
    });
    //zyf_v.deserialize({'a':'1','b':'2','c':'1,4','d':'1,3,5'});
    //zyf_v.loadRules();
    //console.log(zyf_v.elements)
});