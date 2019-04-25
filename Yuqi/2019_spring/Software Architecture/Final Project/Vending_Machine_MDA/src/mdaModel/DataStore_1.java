package utility;

public class DataStore_1 extends DataStore {
    private int temp_p;
    private int temp_v;
    private int price;
    private int cf;
    public void setTempP(int p) {
        this.temp_p = p;
    }
    public void setTempV(int v) {
        this.temp_v = v;
    }
    public void setPrice(int p) {
        this.price = p;
    }
    public void setCf(int c) {
        this.cf = c;
    }
    public int getTempP() {
        return temp_p;
    }
    public int getTempV() {
        return temp_v;
    }
    public int getPrice() {
        return price;
    }
    public int getCf() {
        return cf;
    }


}