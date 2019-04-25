package statePattern;

public class CoinsInserted {

public void coin(int f) {
    op.ReturnCoins();
}
public void additive(int a) {
    if (A.contains(a)) {
        A.remove(a);
    }else {
        A.add(a);
    }
}

public void dispose_drink(int d) {
    if (k > 1) {
        op.DisposeDrink(d);
        op.DisposeAdditive(A);
        k = k -1;
        op.ZeroCF();
        m.change_state(2);
    } else if (k <= 1) {
        op.DisposeDrink(d);
        op.DisposeAdditive(A);
        m.change_state(1);
    }
  
}

cancel() {
    op.ReturnCoins();
    op.ZeroCF();
}
} 