package com.focapy.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONObject;

public class FocusCompletionReceiver extends BroadcastReceiver {
    public static final String ACTION_FOCUS_COMPLETE = "com.focapy.app.FOCUS_COMPLETE";
    public static final String EXTRA_TOKEN = "focus_token";
    private static final String CHANNEL_ID = "focapy_widget_focus";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            FocapyWidgetState.restoreAlarmAfterBoot(context);
            return;
        }
        if (!ACTION_FOCUS_COMPLETE.equals(intent.getAction())) return;
        JSONObject event = FocapyWidgetState.completeFocusFromAlarm(context, intent.getStringExtra(EXTRA_TOKEN));
        if (event == null) return;
        TaskMonitorWidgetProvider.enqueueCompletedFocus(context, event);
        FocusWidgetProvider.updateAllWidgets(context);
        showNotification(context);
    }

    private static void showNotification(Context context) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(new NotificationChannel(
                CHANNEL_ID, "Foco concluído", NotificationManager.IMPORTANCE_HIGH));
        }
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(
            context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return;
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("Foco concluído")
            .setContentText("Seu tempo foi cultivado. A recompensa será guardada no FoCapy.")
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH);
        manager.notify(49025, notification.build());
    }
}
