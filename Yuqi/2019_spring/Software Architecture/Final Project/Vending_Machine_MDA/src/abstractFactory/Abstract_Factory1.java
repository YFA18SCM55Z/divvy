package abstractFactory;

public class Abstract_Factory1 extends Abstract_Factory {
    private DataStore d;
    public void getStorePrice() {
        return new StorePrice1();
    }
    public void getZeroCF() {
        return new ZeroCF1();
    }
    public void getIncreaseCF() {
        return new IncreaseCF1();
    }
    public void getReturnCoins() {
        return new ReturnCoins1();
    }
    public void getDisposeDrink() {
        return new DisposeDrink1();
    }
    public void getDisposeAdditive() {
        return new DisposeAdditive1();
    }
    public DataStore getDataStore() {
        return d; 
    }
}