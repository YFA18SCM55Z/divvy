package runze.myapplication.presenters.inputScreenPresenter;

import runze.myapplication.presenters.IPresenter;
import runze.myapplication.views.inputScreenView.IInputScreenView;

public interface IInputScreenPresenter extends IPresenter<IInputScreenView> {
    /**
     * Presenter method for populating home screen
     */
    void updateView(int index);

    void saveData(String category, double amount);
}
