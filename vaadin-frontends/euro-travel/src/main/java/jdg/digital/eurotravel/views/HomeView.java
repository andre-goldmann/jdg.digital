package jdg.digital.eurotravel.views;

import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dependency.JavaScript;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.component.page.Meta;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.PageTitle;

@Route("")
@CssImport("./themes/my-theme/home-view.css")
//@PageTitle("Welcome - Euro Travel")
//@Meta(name = "viewport", content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover")
public class HomeView extends VerticalLayout {

    public HomeView() {
        // Configure the main layout
        setSizeFull();
        setPadding(false);
        setSpacing(false);
        addClassName("home-view");

        // Create the top curved section with illustration
        Div topSection = new Div();
        topSection.addClassName("top-section");

        // Add the illustration
        Image illustration = new Image("themes/my-theme/images/project_feedback.png", "Welcome Illustration");
        illustration.addClassName("welcome-illustration");
        topSection.add(illustration);

        // Add the logo
        Image logo = new Image("themes/my-theme/images/logo.png", "Logo");
        logo.addClassName("logo");
        topSection.add(logo);

        // Create the input section
        VerticalLayout inputSection = new VerticalLayout();
        inputSection.addClassName("input-section");
        inputSection.setPadding(false);
        inputSection.setSpacing(false);
        inputSection.setWidthFull();

        // Phone number label
        H3 phoneLabel = new H3("Enter your phone");
        phoneLabel.addClassName("phone-label");

        // Phone input with icon
        HorizontalLayout phoneInputLayout = new HorizontalLayout();
        phoneInputLayout.addClassName("phone-input-layout");
        phoneInputLayout.setWidthFull();
        phoneInputLayout.setPadding(false);

        Image phoneIcon = new Image("themes/my-theme/images/phone_icon.png", "Phone");
        phoneIcon.addClassName("phone-icon");

        TextField phoneInput = new TextField();
        phoneInput.addClassName("phone-input");
        phoneInput.setPlaceholder("");
        phoneInput.setWidth("100%");

        phoneInputLayout.add(phoneIcon, phoneInput);
        phoneInputLayout.setAlignItems(FlexComponent.Alignment.CENTER);
        phoneInputLayout.setFlexGrow(1, phoneInput);

        inputSection.add(phoneLabel, phoneInputLayout);

        // Create the button section
        Div buttonContainer = new Div();
        buttonContainer.addClassName("button-container");

        Button enterButton = new Button("Enter");
        enterButton.addClassName("enter-button");
        enterButton.setIconAfterText(true);
        enterButton.setIcon(VaadinIcon.ARROW_RIGHT.create());

        buttonContainer.add(enterButton);

        // Add flexible spacer
        Div spacer = new Div();
        spacer.addClassName("spacer");

        // Create the bottom indicators
        HorizontalLayout indicators = new HorizontalLayout();
        indicators.addClassName("indicators");

        Div rectangle = new Div();
        rectangle.addClassName("indicator-rectangle");

        Span dot1 = new Span();
        dot1.addClassName("indicator-dot");

        Span dot2 = new Span();
        dot2.addClassName("indicator-dot");

        indicators.add(dot2, rectangle, dot1);
        indicators.setAlignItems(FlexComponent.Alignment.CENTER);
        indicators.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);

        // Add all sections to the main layout
        add(topSection, inputSection, buttonContainer, spacer, indicators);
    }
}
