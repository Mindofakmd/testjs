(function($){
    function zyf_v() {
        this.rules = new Array();
        this.elements = new Map();
        this.add = function(rule){
            this.rules.push(rule);
            this.init_rule();
        };
        this.serialize_format = function(){
            var ls = this.elements.list();
            var s_obj = new Map();
            for(var i=0;i<ls.length;i++){
                var z_model = ls[i].value.z_model;
                var arr = s_obj.get(z_model);
                if(arr){
                    arr.push(ls[i].value);
                }else{
                    var newarr = [ls[i].value];
                    s_obj.put(z_model,newarr);
                }
            }
            var ser = "{";
            var ll = s_obj.list();
            for(var i=0;i<ll.length;i++){
                var sv = ll[i].value;
                var s_s = "{";
                for(var j=0;j<sv.length;j++){
                    if(j!=(sv.length-1))
                        s_s += "'"+sv[j].name + "':'" + sv[j].value() + "',";
                    else
                        s_s += "'"+sv[j].name + "':'" + sv[j].value()+"'";
                }
                s_s += "}"

                if(i!=(ll.length-1))
                    ser += "'"+ll[i].key + "':" + s_s + ",";
                else
                    ser += "'"+ll[i].key + "':" + s_s;
            }
            ser += "}"
            return ser;
        };
        this.serialize = function () {
          var ls = this.elements.list();
          var ser = "{";
          for (var i=0;i<ls.length;i++){
              if(i!=(ls.length-1))
                  ser += "'"+ls[i].key + "':'" + ls[i].value.value() + "',";
              else
                  ser += "'"+ls[i].key + "':'" + ls[i].value.value()+"'";
          }
          ser += "}";
          return ser;
        };
        this.deserialize = function (data) {
            for(x in data){
                var el = this.elements.get(x);
                el.fill(data[x]);
            }
        };
        this.loadRules = function () {
            for(var i=0;i<this.rules.length;i++){
                var rule = this.rules[i];
                var element = this.elements.get(rule.one);
                var other_e = this.elements.get(rule.another);
                other_e.resetRules({"key":rule.one});
                var val = element.value();
                if(val==""||val==null){
                    other_e.replaceRules(new s_rule(rule.one,"","l"))
                }
                var vs = val.split(",");
                for(var j=0;j<rule.data.length;j++){
                    var effect = false;
                    var rs = rule.data[j][0].split(",");
                    for(var k=0;k<rs.length;k++){
                        for(var y=0;y<vs.length;y++){
                            if(vs[y] == rs[k]){
                                effect = true;
                                break;
                            }
                        }
                    }
                    if (effect){
                        if (rule.data[j][2]=="avoid"){
                            if (element.z_type == "single"){
                                if(rule.data[j].length==4){
                                    other_e.replaceRules(new s_rule(rule.one,rule.data[j][1],rule.data[j][3]));
                                }else
                                    other_e.replaceRules(new s_rule(rule.one,rule.data[j][1]));
                            } else if (element.z_type=="multi") {
                                if(rule.data[j].length==4) {
                                    other_e.updateRules(new s_rule(rule.one,rule.data[j][1],rule.data[j][4]));
                                }else
                                    other_e.updateRules(new s_rule(rule.one,rule.data[j][1]));
                            }
                        }  else {
                            if(rule.data[j].length==4) {
                                other_e.replaceRules(new s_rule(rule.one,rule.data[j][2],rule.data[j][4]));
                            }else{
                                other_e.replaceRules(new s_rule(rule.one,rule.data[j][2]));
                            }
                            break;
                        }
                    }
                }
                other_e.initRules();

            }
        }
        this.init_rule = function () {
            for(var i=0;i<this.rules.length;i++){
                var rule = this.rules[i];
                var element = this.elements.get(rule.one);
                var other_e = this.elements.get(rule.another);
                if(rule.z_event == "click"){
                    element.instance().click(function () {
                        other_e.resetRules({"key":rule.one});
                        var val = element.value();
                        if(val==""||val==null){
                            other_e.replaceRules(new s_rule(rule.one,"","l"))
                        }
                        var vs = val.split(",");
                        for(var j=0;j<rule.data.length;j++){
                            var effect = false;
                            var rs = rule.data[j][0].split(",");
                            for(var k=0;k<rs.length;k++){
                                for(var y=0;y<vs.length;y++){
                                    if(vs[y] == rs[k]){
                                        effect = true;
                                        break;
                                    }
                                }
                            }
                            if (effect){
                                if (rule.data[j][2]=="avoid"){
                                    if (element.z_type == "single"){
                                        if(rule.data[j].length==4){
                                            other_e.replaceRules(new s_rule(rule.one,rule.data[j][1],rule.data[j][3]));
                                        }else
                                            other_e.replaceRules(new s_rule(rule.one,rule.data[j][1]));
                                    } else if (element.z_type=="multi") {
                                        if(rule.data[j].length==4) {
                                            other_e.updateRules(new s_rule(rule.one,rule.data[j][1],rule.data[j][4]));
                                        }else
                                            other_e.updateRules(new s_rule(rule.one,rule.data[j][1]));
                                    }
                                }  else{
                                    if(rule.data[j].length==4) {
                                        other_e.replaceRules(new s_rule(rule.one,rule.data[j][2],rule.data[j][4]));
                                    }else{
                                        other_e.replaceRules(new s_rule(rule.one,rule.data[j][2]));
                                    }
                                    break;
                                }
                            } 
                        }
                        other_e.initRules();
                    });
                }else if(rule.z_event == "change"){
                    element.instance().change(function () {
                        other_e.resetRules({"key":rule.one});
                        var val = element.value();
                        if(val==""||val==null){
                            other_e.replaceRules(new s_rule(rule.one,"","l"))
                        }
                        var vs = val.split(",");
                        for(var j=0;j<rule.data.length;j++){
                            var effect = false;
                            var rs = rule.data[j][0].split(",");
                            for(var k=0;k<rs.length;k++){
                                for(var y=0;y<vs.length;y++){
                                    if(vs[y] == rs[k]){
                                        effect = true;
                                        break;
                                    }
                                }
                            }
                            if (effect){
                                if (rule.data[j][2]=="avoid"){
                                    if (element.z_type == "single"){
                                        if(rule.data[j].length==4){
                                            other_e.replaceRules(new s_rule(rule.one,rule.data[j][1],rule.data[j][3]));
                                        }else
                                            other_e.replaceRules(new s_rule(rule.one,rule.data[j][1]));
                                    } else if (element.z_type=="multi") {
                                        if(rule.data[j].length==4) {
                                            other_e.updateRules(new s_rule(rule.one,rule.data[j][1],rule.data[j][4]));
                                        }else
                                            other_e.updateRules(new s_rule(rule.one,rule.data[j][1]));
                                    }
                                }  else {
                                    if(rule.data[j].length==4) {
                                        other_e.replaceRules(new s_rule(rule.one,rule.data[j][2],rule.data[j][4]));
                                    }else{
                                        other_e.replaceRules(new s_rule(rule.one,rule.data[j][2]));
                                    }
                                    break;
                                }
                            }
                        }

                    });
                    other_e.initRules();
                }
            }
        };
        this.init = function(){
            var $all =  $('input,select,textarea');
            var es = this.elements;
            $all.each(function(){
                var el = new element();
                el.init(this);
                if(el.name!=""&&el.name!=null)
                    es.put(el.name,el);
            });
        }
    }

    function element(){
        this.elements = new Array();
        this.name = "";
        this.id = "";
        this.tagName = "";
        this.z_type = "";
        this.z_model = "";
        this.z_row = "";
        this.rules = new Array();
        this.instance = function(){//返回jquery对象
            var ins = $("[name='"+this.name+"']");
            return ins;
        };

        this.fill = function (str) {
            if(this.tagName=="INPUT"){
                if(this.z_type=="nothing"){
                    this.instance().val(str);
                }else if(this.z_type=="single"){
                    for(var i=0;i<this.elements.length;i++){
                        if(this.elements[i].value==str){
                            this.elements[i].checked = true;
                            break;
                        }
                    }
                }else if(this.z_type=="multi"){
                    for(var i=0;i<this.elements.length;i++){
                        var ss = str.split(",");
                        for(var j=0;j<ss.length;j++){
                            if(ss[j]==this.elements[i].value){
                                this.elements[i].checked = true;
                                continue;
                            }
                        }
                    }
                }
            }else if(this.tagName=="SELECT"){
                for(var i=0;i<this.elements.length;i++){
                    if(this.elements[i].value==str){
                        this.elements[i].selected = true;
                        break;
                    }
                }
            }else{
                this.instance().html(str);
            }
        }
        this.init = function (obj) {
            this.name = obj.name;
            this.tagName = obj.tagName;
            this.z_model = obj.getAttribute("z_model");
            this.z_row = obj.getAttribute("z_row");
            var es = this.elements;
            if(obj.tagName=="INPUT"){
                if(obj.type == "text"||obj.type == "password"){
                    this.z_type = "nothing";
                    this.id = obj.id;
                }else if(obj.type == "radio"){
                    this.z_type = "single";
                    this.instance().each(function () {
                        es.push(this);
                    });
                }else if(obj.type=="checkbox"){
                    this.instance().each(function () {
                        es.push(this);
                    });
                    this.z_type = "multi";
                }
            }else if(obj.tagName=="SELECT"){
                this.instance().find("option").each(function () {
                    es.push(this);
                });
                this.z_type = "single";
                this.id = obj.id;
            }else{
                this.z_type = "nothing";
                this.id = obj.id;
            }
        };
        this.reset = function(){
            this.show();
            for(var i=0;i<this.elements.length;i++){
                this.elements[i].disabled = false;
            }
        };
        this.initRules = function(){
            var l_rules = new Array();
            var m_rules = new Array();
            var h_rules = new Array();
            this.reset();
            for(var x=0;x<this.rules.length;x++){
                if(this.rules[x].level=="l"){
                    l_rules.push(this.rules[x]);
                }else if(this.rules[x].level=="h"){
                    h_rules.push(this.rules[x]);
                }else{
                    m_rules.push(this.rules[x]);
                }
            }

            for(var x=0;x<l_rules.length;x++){
                if(l_rules[x].value=="show"){
                    this.show();
                }else if(l_rules.value=="hide"){
                    this.hide();
                }else{
                    var rs = l_rules[x].value.split(",");
                    for(var y=0;y<rs.length;y++){
                        for(var z=0;z<this.elements.length;z++){
                            if(rs[y]==this.elements[z].value){
                                if(this.tagName=="SELECT")
                                    this.elements[z].selected = false;
                                else
                                    this.elements[z].checked = false;
                                this.elements[z].disabled = true;
                            }
                        }
                    }
                }
            }
            for(var x=0;x<m_rules.length;x++){
                if(m_rules[x].value=="show"){
                    this.show();
                }else if(m_rules[x].value=="hide"){
                    this.hide();
                }else{
                    var rs = m_rules[x].value.split(",");
                    for(var y=0;y<rs.length;y++){
                        for(var z=0;z<this.elements.length;z++){
                            if(rs[y]==this.elements[z].value){
                                if(this.tagName=="SELECT")
                                    this.elements[z].selected = false;
                                else
                                    this.elements[z].checked = false;
                                this.elements[z].disabled = true;
                            }
                        }
                    }
                }
            }
            for(var x=0;x<h_rules.length;x++){
                if(h_rules[x].value=="show"){
                    this.show();
                }else if(h_rules[x].value=="hide"){
                    this.hide();
                }else{
                    var rs = h_rules[x].value.split(",");
                    for(var y=0;y<rs.length;y++){
                        for(var z=0;z<this.elements.length;z++){
                            if(rs[y]==this.elements[z].value){
                                if(this.tagName=="SELECT")
                                    this.elements[z].selected = false;
                                else
                                    this.elements[z].checked = false;
                                this.elements[z].disabled = true;
                            }
                        }
                    }
                }
            }

        };
        this.updateRules = function(rule){
            if(this.rules.length==0){
                this.rules[0] = rule;
                this.initRules();
                return;
            }
            for(var i=0;i<this.rules.length;i++){
                var add = true;
                if(this.rules[i].key == rule.key){
                    this.rules[i].value += ","+rule.value;
                    add = false;
                    break;
                }
            }
            if(add){
                this.rules[this.rules.length] = rule;
            }
            //this.initRules();
        };
        this.replaceRules = function(rule){
            if(this.rules.length==0){
                this.rules[0] = rule;
                this.initRules();
                return;
            }
            for(var i=0;i<this.rules.length;i++){
                var add = true;
                if(this.rules[i].key == rule.key){
                    this.rules[i].value = rule.value;
                    add = false;
                    break;
                }
            }
            if(add){
                this.rules[this.rules.length] = rule;
            }
            //this.initRules();
        };
        this.resetRules = function(rule){
            for(var i=0;i<this.rules.length;i++){
                if(this.rules[i].key == rule.key){
                    this.rules[i].value = "";
                    break;
                }
            }

        };
        this.value = function(){
            if(this.id){
                return $("#" + this.id).val();
            }
            var val = "";
            for(var i=0;i<this.elements.length;i++){
                if(this.tagName=="SELECT"){
                    if(this.elements[i].selected){
                        if(val==""){
                            val += this.elements[i].value;
                        }else{
                            val +=  ","+this.elements[i].value ;
                        }
                    }
                }else{
                    if(this.elements[i].checked){
                        if(val==""){
                            val += this.elements[i].value;
                        }else{
                            val += ","+this.elements[i].value;
                        }
                    }
                }
            }
            return val;
        };
        this.hide = function(){
            $("#" + this.z_row).hide();
        };
        this.show = function () {
            $("#" + this.z_row).show();
        };

    }

    function rule(obj){
        if(!obj.one){
            console.error("缺少one属性");
            return;
        }
        if(!obj.another){
            console.error("another");
            return;
        }
        if(!obj.z_event){
            obj.z_event = "click";
        }
        return obj;
    }

    function Map(){
        var struct = function(key, value) {
            this.key = key;
            this.value = value;
        };
        // 添加map键值对
        var put = function(key, value){
            for (var i = 0; i < this.arr.length; i++) {
                if ( this.arr[i].key === key ) {
                    this.arr[i].value = value;
                    return;
                }
            };
            this.arr[this.arr.length] = new struct(key, value);
        };
        //  根据key获取value
        var get = function(key) {
            for (var i = 0; i < this.arr.length; i++) {
                if ( this.arr[i].key === key ) {
                    return this.arr[i].value;
                }
            }
            return null;
        };
        //   根据key删除
        var remove = function(key) {
            var v;
            for (var i = 0; i < this.arr.length; i++) {
                v = this.arr.pop();
                if ( v.key === key ) {
                    continue;
                }
                this.arr.unshift(v);
            }
        };
        var list = function () {
            return this.arr;
        }
        //   获取map键值对个数
        var size = function() {
            return this.arr.length;
        };
        // 判断map是否为空
        var isEmpty = function() {
            return this.arr.length <= 0;
        };
        this.arr = new Array();
        this.get = get;
        this.put = put;
        this.remove = remove;
        this.list = list;
        this.size = size;
        this.isEmpty = isEmpty;
    }

    function _$z(){
        return new zyf_v();
    }

    function s_rule(key, value, level){
        if(!level){
            level = "m";
        }
        return {"key":key,"value":value,"level":level};
    }

    window._$z = _$z;
    window.r = rule;

}(jQuery))