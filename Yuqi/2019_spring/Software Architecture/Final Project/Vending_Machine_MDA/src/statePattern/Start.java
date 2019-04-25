package statePattern;

import statePattern.MDAState;

public class Start extends MDAState {
    public void create() {
        op.StorePrice();
        m.change_state(1);}
}