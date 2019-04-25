package utility;

public class DataStore_2 extends DataStore {
    private float temp_p;
    private float temp_v;
    private float price;
    private float cf;
    public void setTempP(float p) {
        this.temp_p = p;
    }
    public void setTempV(float v) {
        this.temp_v = v;
    }
    public void setPrice(float p) {
        this.price = p;
    }
    public void setCf(float c) {
        this.cf = c;
    }
    public float getTempP() {
        return temp_p;
    }
    public float getTempV() {
        return temp_v;
    }
    public float getPrice() {
        return price;
    }
    public float getCf() {
        return cf;
    }


}