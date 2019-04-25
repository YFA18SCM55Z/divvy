package statePattern;

public class Idle extends MDAState {
    public void coin(int f) {
        if (f == 0) {
            op.IncreaseCF();
        } else if (f == 1) {
            op.IncreaseCF();
            A = null;
            m.change_state(3);
        }
    }

    @Override
    public void create() {

    }

    public void insert_cups(int n) {
        if (n > 0) {
            k = k + n;
        }
    }

    public void set_price() {
        op.StorePrice();
    }

    public void card() {
        op.ZeroCF();
        A = null;
        m.change_state(3);
    }

    @Override
    public void additive(int a) {

    }

    @Override
    public void cancel() {

    }

    @Override
    public void dispose_drink(int d) {

    }
}