(function($){
    function zyf_v() {
        this.rules = new Array();
        this.elements = new Map();
        this.s_obj = new Map();
        this.orders = new Array();
        this.add_order = function(order){
            this.orders.push(order);
        };
        this.apply_order = function (o3) {
            //{name1 not null name2 contain 1,2}
            //第二个关键字 not is contain exclude
            var el = this.elements.get(o3[0]);
            if(o3[1]=="is"){
                if(o3[2]=="null"){
                    if(el.value()==""||el.value()==null){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(el.value()==o3[2]){
                        return true;
                    }else{
                        return false;
                    }
                }
            }else if(o3[1]=="not"){
                if(o3[2]=="null"){
                    if(el.value()==""||el.value()==null){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    if(el.value()==o3[2]){
                        return false;
                    }else{
                        return true;
                    }
                }
            }else if(o3[1]=="contain"){
                var vs = o3[2].split(",");
                var vals = el.value().split(",");
                for(var x=0;x<vs.length;x++){
                    for(var y=0;y<vals.length;y++){
                        if(vs[x]==vals[y]){
                            return true;
                        }
                    }
                }
                return false;
            }else{
                var vs = o3[2].split(",");
                var vazs = el.value().split(",");
                for(var x=0;x<vs.length;x++){
                    for(var y=0;y<vazs.length;y++){
                        if(vs[x]==vazs[y]){
                            return false;
                        }
                    }
                }
                return true;
            }
        };
        this.self_use = function(os){
            if(os.indexOf(" and ")!=-1){
                var oss = os.split(" and ");
                var success = true;
                for(var tt=0;tt<oss.length;tt++){
                    var test = this.apply_order(oss[tt].split(" "));
                    success = success&&test;
                }
                return success;
            }else{
                var oss = os.split(" or ");
                var success = false;
                for(var tt=0;tt<oss.length;tt++){
                    var test = this.apply_order(oss[tt].split(" "));
                    success = success||test;
                }
                return success;
            }
        };
        this.check_order = function(func){
            var msg = "";
            for(var z=0;z<this.orders.length;z++){
                var order = this.orders[z];
                //{name1 not null or name3 is 3|name2 contain 1,2}
                var os = order.split("|");
                if(os.length>1){
                    //还没完成呢
                    if(this.self_use(os[0])){
                        if(!this.self_use(os[1])){
                            if(msg==""){
                                msg += z;
                            }else{
                                msg += "," + z;
                            }
                        }
                    }
                }else{
                    //{name1 not null name2 contain 1,2}
                    //第二个关键字 not is contain exclude
                    var o = order.split(" ");
                    if(o.length==3){
                        if(!this.apply_order(o)){
                            if(msg==""){
                                msg += z;
                            }else{
                                msg += "," + z;
                            }
                        }
                    }else if(o.length==6){
                        var o1 = new Array();
                        o1.push(o[0]);
                        o1.push(o[1]);
                        o1.push(o[2]);
                        if(this.apply_order(o1)){
                            var o2 = new Array();
                            o2.push(o[3]);
                            o2.push(o[4]);
                            o2.push(o[5]);
                            if(!this.apply_order(o2)){
                                if(msg==""){
                                    msg += z;
                                }else{
                                    msg += "," + z;
                                }
                            }
                        }
                    }
                }
            }
            func(msg);
        };
        this.add = function(rule){
            this.rules.push(rule);

        };
        this.serialize_format = function(){
            var ser = "{";
            var ll = this.s_obj.list();
            for(var i=0;i<ll.length;i++){
                if(ll[i].key=="self_obj_zyf"){
                    var zzz = ll[i].value[0];
                    if(i!=(ll.length-1))
                        ser += "\""+ zzz.name + "\":" + zzz.value() + ",";
                    else
                        ser += "\""+ zzz.name + "\":" + zzz.value();

                    continue;
                }
                var sv = ll[i].value;
                var s_s = "{";
                for(var j=0;j<sv.length;j++){
                    if(j!=(sv.length-1))
                        s_s += "\""+sv[j].name + "\":\"" + sv[j].value() + "\",";
                    else
                        s_s += "\""+sv[j].name + "\":\"" + sv[j].value()+"\"";
                }
                s_s += "}"

                if(i!=(ll.length-1))
                    ser += "\""+ll[i].key + "\":" + s_s + ",";
                else
                    ser += "\""+ll[i].key + "\":" + s_s;
            }
            ser += "}"
            return ser;
        };
        this.serialize = function () {
          var ls = this.elements.list();
          var ser = "{";
          for (var i=0;i<ls.length-1;i++){
              if(i!=(ls.length-2))
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
        this.deserialize_format = function (data) {
            for(var x in data){
                var es = this.s_obj.get(x);
                var ds = data[x];
                if(!es){
                    es = this.s_obj.get("self_obj_zyf");
                    if(!es){
                        continue;
                    }else{
                        for(var r=0;r<es.length;r++){
                            if(es[r].name == x){
                                es[r].fill(ds);
                                break;
                            }
                        }
                    }
                }
                for(var r=0;r<es.length;r++){
                    for(var o in ds){
                        if(es[r].name == o){
                            es[r].fill(ds[o]);
                            break;
                        }
                    }
                }
            }
        };
        this.loadRules = function () {
            for(var i=0;i<this.rules.length;i++){
                (function(rule,els){
                    var other_e = els.get(rule.another);
                    if(rule.basic){
                        if(rule.one){
                            if (rule.func){
                                rule.func();
                                return;
                            }
                            other_e.add_b(new s_rule("basic"+i,rule.data[0][1],rule.data[0][2]),"h");
                            other_e.initRules();
                        }
                        return;
                    }
                    var element = els.get(rule.one);
                    other_e.resetRules(rule.one);
                    var val = element.value();
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
                                        other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                    }else
                                        other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                } else if (element.z_type=="multi") {
                                    if(rule.data[j].length==4) {
                                        other_e.updateRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                    }else
                                        other_e.updateRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                }
                            }else if (rule.data[j][2]=="if"){
                                var _vs = element.value().split(",");
                                var _rs = rule.data[j][1].split(",");
                                var _c = true;
                                for (var _j=0;_j<_rs.length;_j++){
                                    var _b = false;
                                    for (var _i=0;_i<_vs.length;_i++){
                                        if(_rs[_j]==_vs[_i]){
                                            _b = true;
                                        }
                                    }
                                    if(!_b){
                                        _c = false;
                                        break;
                                    }
                                }
                                if(_c){
                                    //rule.func(rule.one+"_"+rule.another+"_"+rule.data[j][0]);
                                }

                            }  else {
                                if(rule.data[j].length==4) {
                                    other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                }else{
                                    other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                }
                            }
                        }
                    }
                    other_e.initRules();
                })(this.rules[i],this.elements);
            }
        };
        this.init_rule = function () {
            for(var i=0;i<this.rules.length;i++){
                (function(rule,els){
                    var other_e = els.get(rule.another);
                    if(rule.basic){
                        if(rule.one){
                            if (rule.func){
                                rule.func();
                                return;
                            }
                            other_e.add_b(new s_rule("basic"+i,rule.data[0][1],rule.data[0][2]),"h");
                            other_e.initRules();
                        }
                        return;
                    }
                    var element = els.get(rule.one);
                    if(rule.z_event == "click"){
                        element.instance().click(function (event) {
                            if(!event.originalEvent.isTrusted){
                                event.preventDefault();
                            }
                            other_e.resetRules(rule.one);
                            var val = element.value();
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
                                                other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                            }else
                                                other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                        } else if (element.z_type=="multi") {
                                            if(rule.data[j].length==4) {
                                                other_e.updateRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                            }else
                                                other_e.updateRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                        }
                                    }else if (rule.data[j][2]=="if"){
                                        var _vs = other_e.value().split(",");
                                        var _rs = rule.data[j][1].split(",");
                                        var _c = true;
                                        for (var _j=0;_j<_rs.length;_j++){
                                            var _b = false;
                                            for (var _i=0;_i<_vs.length;_i++){
                                                if(_rs[_j]==_vs[_i]){
                                                    _b = true;
                                                }
                                            }
                                            if(!_b){
                                                _c = false;
                                                break;
                                            }
                                        }
                                        if(_c){
                                            rule.func(rule.one+"_"+rule.another+"_"+rule.data[j][0]);
                                        }

                                    }  else {
                                        if(rule.data[j].length==4) {
                                            other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                        }else{
                                            other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                        }
                                    }
                                }
                            }
                            other_e.initRules();
                        });
                    }else if(rule.z_event == "change"){
                        element.instance().change(function () {
                            other_e.resetRules(rule.one);
                            var val = element.value();
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
                                                other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                            }else
                                                other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                        } else if (element.z_type=="multi") {
                                            if(rule.data[j].length==4) {
                                                other_e.updateRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                            }else
                                                other_e.updateRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                        }
                                    }else if (rule.data[j][2]=="if"){
                                        var _vs = other_e.value().split(",");
                                        var _rs = rule.data[j][1].split(",");
                                        var _c = true;
                                        for (var _j=0;_j<_rs.length;_j++){
                                            var _b = false;
                                            for (var _i=0;_i<_vs.length;_i++){
                                                if(_rs[_j]==_vs[_i]){
                                                    _b = true;
                                                }
                                            }
                                            if(!_b){
                                                _c = false;
                                                continue;
                                            }
                                        }
                                        if(_c){
                                            rule.func(rule.one+"_"+rule.another+"_"+rule.data[j][0]);
                                        }

                                    }else {
                                        if(rule.data[j].length==4) {
                                            other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2],rule.data[j][3]));
                                        }else{
                                            other_e.replaceRules(new s_rule(rule.one+rule.data[j][2],rule.data[j][1],rule.data[j][2]));
                                        }
                                    }
                                }
                            }
                            other_e.initRules();
                        });

                    }
                })(this.rules[i],this.elements);
            }
        };
        this.update_element = function (e_name) {//慎用
            var el = this.elements.get(e_name);
            el.init(el.instance()[0]);
        };
        this.init = function(){
            var $all =  $('input,select,textarea');
            var es = this.elements;
            var so = this.s_obj;
            $all.each(function(){
                var el = new element();
                el.init(this);
                if(el.name!=""&&el.name!=null){
                    if(es.get(el.name)){

                    }else{
                        var z_model = el.z_model;
                        var arr = so.get(z_model);
                        if(arr){
                            arr.push(el);
                        }else{
                            so.put(z_model,[el]);
                        }
                    }
                    es.put(el.name,el);
                }
            });
            var def_el = new element();
            def_el.name = "__$d__";
            def_el.def_value = "__def_value__";
            es.put(def_el.name,def_el);
        }
    }

    function element(){
        this.elements = new Array();
        this.def_value = "";
        this.get_def_v = function(){
          return this.def_value;
        };
        this.name = "";
        this.id = "";
        this.tagName = "";
        this.z_type = "";
        this.z_model = "";
        this.z_row = "";
        this.rules = new Array();
        this.basic_r = new Array();
        this.instance = function(){//返回jquery对象
            var ins = $("[name='"+this.name+"']");
            return ins;
        };
        this.add_b = function(rule){
            this.basic_r.push(rule);
        };
        this.fill = function (str,boo,coo) {
            if(!str){
                return;
            }
            if(this.tagName=="INPUT"){
                if(this.z_type=="nothing"){
                    this.instance().val(str);
                    if(boo){
                        this.instance().attr("disabled",true);
                    }
                }else if(this.z_type=="single"){
                    for(var i=0;i<this.elements.length;i++){
                        if(this.elements[i].value==str){
                            this.elements[i].checked = true;
                            if(coo){
                                this.elements[i].click();
                            }
                            if(boo){
                                this.elements[i].disabled = true;
                            }
                            break;
                        }
                    }
                }else if(this.z_type=="multi"){
                    for(var i=0;i<this.elements.length;i++){
                        var ss = String(str).split(",");
                        for(var j=0;j<ss.length;j++){
                            if(ss[j]==this.elements[i].value){
                                this.elements[i].checked = true;
                                this.def_value = this.value();
                                if(coo){
                                    this.elements[i].click();
                                }
                                if(boo){
                                    this.elements[i].disabled = true;
                                }
                                this.def_value = "";
                                continue;
                            }
                        }
                    }
                }
            }else if(this.tagName=="SELECT"){
                var ss = String(str).split(",");
                for(var i=0;i<this.elements.length;i++){
                    for(var q=0;q<ss.length;q++){
                        if(this.elements[i].value==ss[q]){
                            this.elements[i].selected = true;
                            if(coo){
                                $(this.elements[i]).change();
                            }
                            if(boo){
                                this.elements[i].disabled = true;
                            }
                        }
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
                if(obj.type == "text"||obj.type == "password"||obj.type == "hidden"|| obj.type == "date"){
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
                if(obj.multiple){
                    this.z_type = "multi";
                }else{
                    this.z_type = "single";
                    this.id = obj.id;
                }
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
                if(l_rules[x].ctrl=="show"){
                    this.show();
                }else if(l_rules[x].ctrl=="hide"){
                    this.hide();
                }else if(l_rules[x].ctrl=="disabled"){
                    this.disabled();
                }else if(l_rules[x].ctrl=="enabled"){
                    this.enabled();
                }else if(l_rules[x].ctrl=="onlycheck"){
                    this.fill(l_rules[x].value,false,true);
                }else if(l_rules[x].ctrl=="checked"){
                    this.fill(l_rules[x].value,true,true);
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
                if(m_rules[x].ctrl=="show"){
                    this.show();
                }else if(m_rules[x].ctrl=="hide"){
                    this.hide();
                }else if(m_rules[x].ctrl=="disabled"){
                    this.disabled();
                }else if(m_rules[x].ctrl=="enabled"){
                    this.enabled();
                }else if(m_rules[x].ctrl=="onlycheck"){
                    this.fill(m_rules[x].value,false,true);
                }else if(m_rules[x].ctrl=="checked"){
                    this.fill(m_rules[x].value,true,true);
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
                if(h_rules[x].ctrl=="show"){
                    this.show();
                }else if(h_rules[x].ctrl=="hide"){
                    this.hide();
                }else if(h_rules[x].ctrl=="disabled"){
                    this.disabled();
                }else if(h_rules[x].ctrl=="enabled"){
                    this.enabled();
                }else if(h_rules[x].ctrl=="onlycheck"){
                    this.fill(h_rules[x].value,false,true);
                }else if(h_rules[x].ctrl=="checked"){
                    this.fill(h_rules[x].value,true,true);
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
            var b_rules = this.basic_r;
            for(var x=0;x<b_rules.length;x++){
                if(b_rules[x].ctrl=="show"){
                    this.show();
                }else if(b_rules[x].ctrl=="hide"){
                    this.hide();
                }else if(b_rules[x].ctrl=="disabled"){
                    this.disabled();
                }else if(b_rules[x].ctrl=="enabled"){
                    this.enabled();
                }else if(b_rules[x].ctrl=="onlycheck"){
                    this.fill(b_rules[x].value);
                }else if(b_rules[x].ctrl=="checked"){
                    this.fill(b_rules[x].value,true);
                }else{
                    var rs = b_rules[x].value.split(",");
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
        this.disabled = function () {
            this.instance().val("");
            this.instance().attr("disabled",true);
        };
        this.enabled = function () {
            this.instance().attr("disabled",false);
        }
        this.updateRules = function(rule){
            if(this.rules.length==0){
                this.rules[0] = rule;
                //this.initRules();
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
        this.resetRules = function(key){
            for(var o=0;o<this.rules.length;o++){
                var k = this.rules[o].key;
                if(k==(key+"avoid")||k==(key+"if")||k==(key+"checked")||k==(key+"onlycheck")
                    ||k==(key+"show")||k==(key+"hide")||k==(key+"disabled")||k==(key+"enabled")){
                    this.rules[o].value = "";
                }
            }

        };
        this.value = function(){
            if(this.get_def_v()!=""){
                return this.get_def_v();
            }
            if(this.id){
                var v = $("#" + this.id).val();
                if(v==null){
                    v = "";
                }
                return v.toString();
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

    function s_rule(key, value, ctrl, level){
        if(!level){
            level = "m";
        }
        return {"key":key,"value":value,"level":level,"ctrl":ctrl};
    }

    function gift(){
        return {"name":"__$d__","value":"__def_value__"};
    }

    window.gift = gift;
    window._$z = _$z;
    window.r = rule;

}(jQuery))