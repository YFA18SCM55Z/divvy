package utility;

import statePattern.*;

public class MDA_EFSM {
    private MDAState S;
    private MDAState[] LS = new MDAState[4];
    private OP  op;

    public MDA_EFSM(OP op) {
        this.op = op;
        LS[0] = new Start(op);
        LS[1] = new NoCups(op);
        LS[2] = new Idle(op);
        LS[3] = new CoinsInserted(op);
        this.S = LS[0];
    }

    public void create() {
        S.create();
        if(S.getId() == 0) {
            S=LS[1];
        }
    }
    public void insert_cups(int n) {
        if (n > 0) {
            S.insert_cups(n);
            if (S.getId() == 1) {
                S = LS[2];
            }
        }

    }
    public void coin(int f) {
        S.coin(f);
        if (f == 1 && S.getId()== 2) {
            S =LS[3];
        }
    }
    public void card() {
        S.card();
        if (S.getId() == 2) {
            S = LS[3];
        }
    }
    public void cancel() {
        S.cancel();
    }
    public void set_price() {
        S.set_price();
    }
    public void dispose_drink(int d) {
        S.dispose_drink(d);
    }
    public void additive(int a) {
        S.additive(a);
    }
}