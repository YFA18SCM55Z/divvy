package abstractFactory;

public class Abstract_Factory2 extends Abstract_Factory {
    private DataStore d;
    
    public void getStorePrice() {
        return new StorePrice2();
    }
    
    public void getZeroCF() {
        return new ZeroCF2();
    }
    
    public void getIncreaseCF() {
        return new IncreaseCF2();
    }
    
    public void getReturnCoins() {
        return new ReturnCoins2();
    }
    public void getDisposeDrink() {
        return new DisposeDrink2();
    }
    
    public void getDisposeAdditive() {
        return new DisposeAdditive2();
    }
    
    public DataStore getDataStore() {
        return d; 
    }
}