package abstractFactory;

public abstract class Abstract_Factory {
    protected DataStore d;
    public abstract void getStorePrice(); // abstract operation
    public abstract void getZeroCF();     // abstract operation
    public abstract void getIncreaseCF();   // abstract operation
    public abstract void getReturnCoins();   // abstract operation
    public abstract void getDisposeDrink();   // abstract operation
    public abstract void getDisposeAdditive();  // abstract operation
    public abstract DataStore getDataStore();   // abstract operation


}