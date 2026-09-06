package com.focapy.app;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.concurrent.Executor;

@CapacitorPlugin(name = "DevAuth")
public class DevAuthPlugin extends Plugin {
    @PluginMethod
    public void authenticate(PluginCall call) {
        FragmentActivity activity = (FragmentActivity) getActivity();
        int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL;
        if (BiometricManager.from(activity).canAuthenticate(authenticators) != BiometricManager.BIOMETRIC_SUCCESS) {
            call.reject("A biometria ou bloqueio de tela do Android não está disponível.");
            return;
        }
        Executor executor = ContextCompat.getMainExecutor(activity);
        BiometricPrompt prompt = new BiometricPrompt(activity, executor, new BiometricPrompt.AuthenticationCallback() {
            @Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) { call.resolve(); }
            @Override public void onAuthenticationError(int code, CharSequence message) { call.reject(message.toString()); }
        });
        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
            .setTitle("Desbloquear modo de desenvolvimento")
            .setSubtitle("Confirme sua identidade no aparelho")
            .setAllowedAuthenticators(authenticators)
            .build();
        prompt.authenticate(promptInfo);
    }
}
