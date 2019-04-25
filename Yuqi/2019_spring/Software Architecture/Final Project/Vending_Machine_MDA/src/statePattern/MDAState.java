package statePattern;

import java.util.ArrayList;

import com.sun.tools.javac.util.List;

public abstract class MDAState {
    protected OP op = new OP();
    protected int k;
    protected List A = new ArrayList<Integer>();
    protected MDA_EFSM m = new MDA_EFSM();
    public abstract void create();              //abstract operation 
    public abstract void insert_cups(int n);        //abstract operation
    public abstract void coin(int f);               //abstract operation
    public abstract void set_price();               //abstract operation
    public abstract void card();                    //abstract operation
    public abstract void additive(int a);           //abstract operation
    public abstract void cancel();                  //abstract operation
    public abstract void dispose_drink(int d);      //abstract operation

}