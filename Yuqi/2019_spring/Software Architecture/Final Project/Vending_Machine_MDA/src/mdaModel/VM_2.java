package utility;

import abstractFactory.Abstract_Factory;
import abstractFactory.Abstract_Factory2;

public class VM_2 {
    private MDA_EFSM m = new MDA_EFSM();
    private DataStore_2 d = new DataStore_2();
    private Abstract_Factory af = new Abstract_Factory2();
    private OP op = new OP();
    public void CREATE(float p) {
        d.setTempP(p);
        m.create();
    }
    public void COIN(float v) {
       d.setTempV(v);
       if (d.getCf() + v >= d.getPrice()) {
           m.coin(1);
       } else {
           m.coin(0);
       }
    }
    public void SUGAR() {
        m.additive(2);
    }
    public void CREAM() {
        m.additive(1);
    }
    public void COFFEE() {
        m.dispose_drink(1);
    }
    public void InsertCups(int n) {
        m.insert_cups(n);
    }
    public void SetPrice(float p) {
        d.setTempP(p);
        m.set_price();
    }
    public void CANCEL() {
        m.cancel();
    }

}