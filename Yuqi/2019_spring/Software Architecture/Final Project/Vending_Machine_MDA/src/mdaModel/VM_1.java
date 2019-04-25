package utility;

import abstractFactory.Abstract_Factory;
import abstractFactory.Abstract_Factory1;

public class VM_1 {
    private DataStore_1 d = new DataStore_1();
    private Abstract_Factory af;
    private OP op = new OP();
    private MDA_EFSM m;
    public VM_1() {
        af =  new Abstract_Factory1(d);
        op.initialize(af);
        m = new MDA_EFSM(op);
    }
    public void create(int p) {
        d.setTempP(p);
        m.create();
    }
    public void coin(int v) {
       d.setTempV(v);
       if (d.getCf() + v >= d.getPrice()) {
           m.coin(1);
       } else {
           m.coin(0);
       }
    }

    public void card(float x) {
        if (x >= d.getPrice()) {
            m.card();
        }
    }
    public void sugar() {
        m.additive(1);
    }
    public void tea() {
        m.dispose_drink(1);
    }
    public void chocolate() {
        m.dispose_drink(2);
    }
    public void insert_cups(int n) {
        m.insert_cups(n);
    }
    public void set_price(int p) {
        d.setTempP(p);
        m.set_price();
    }
    public void cancel() {
        m.cancel();
    }

}