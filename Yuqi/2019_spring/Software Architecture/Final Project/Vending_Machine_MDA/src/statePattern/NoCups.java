package statePattern;

import statePattern.MDAState;

public class NoCups extends MDAState {
    public void coin(int f) {
        op.ReturnCoins();
    }
    public void insert_cups(int n) {
        if (n > 0) {
            k=n;
            op.ZeroCF();
            m.change_state(2);
        }
    }
}