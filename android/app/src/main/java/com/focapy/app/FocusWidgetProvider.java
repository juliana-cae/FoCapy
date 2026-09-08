package com.focapy.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.RemoteViews;

public class FocusWidgetProvider extends AppWidgetProvider {
 private static final String ACTION="com.focapy.app.FOCUS_WIDGET", EXTRA="action", FOCUS="focus", STOPWATCH="stopwatch", PAUSE="pause", END="end";
 @Override public void onUpdate(Context c,AppWidgetManager m,int[] ids){for(int id:ids)m.updateAppWidget(id,views(c,id));}
 @Override public void onReceive(Context c,Intent i){super.onReceive(c,i);String a=i.getStringExtra(EXTRA);if(FOCUS.equals(a))FocapyWidgetState.start(c,"foco");else if(STOPWATCH.equals(a))FocapyWidgetState.start(c,"cronometro");else if(PAUSE.equals(a))FocapyWidgetState.pause(c);else if(END.equals(a))FocapyWidgetState.reset(c);if(a!=null)refresh(c);}
 private static RemoteViews views(Context c,int id){RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.focapy_focus_widget);boolean active=FocapyWidgetState.hasSession(c),running=FocapyWidgetState.running(c),focus="foco".equals(FocapyWidgetState.mode(c));boolean finished=FocapyWidgetState.isFocusFinished(c);v.setViewVisibility(R.id.focus_widget_picker,active?View.GONE:View.VISIBLE);v.setViewVisibility(R.id.focus_widget_session,active?View.VISIBLE:View.GONE);v.setTextViewText(R.id.focus_widget_status,!active?"Escolha um modo para começar":finished?"FOCO CONCLUÍDO":focus?(running?"FOCO · 25 MIN":"FOCO PAUSADO"):(running?"CRONÔMETRO EM ANDAMENTO":"CRONÔMETRO PAUSADO"));v.setChronometer(R.id.focus_widget_timer,FocapyWidgetState.timerBase(c),null,running&&!finished);v.setChronometerCountDown(R.id.focus_widget_timer,focus);v.setViewVisibility(R.id.focus_widget_pause,running&&!finished?View.VISIBLE:View.GONE);v.setTextViewText(R.id.focus_widget_pause,"Pausar");v.setViewVisibility(R.id.focus_widget_end,View.VISIBLE);v.setOnClickPendingIntent(R.id.focus_widget_start,pending(c,FOCUS,id));v.setOnClickPendingIntent(R.id.focus_widget_stopwatch,pending(c,STOPWATCH,id));v.setOnClickPendingIntent(R.id.focus_widget_pause,pending(c,PAUSE,id));v.setOnClickPendingIntent(R.id.focus_widget_end,pending(c,END,id));return v;}
 private static PendingIntent pending(Context c,String a,int id){Intent i=new Intent(c,FocusWidgetProvider.class).setAction(ACTION).putExtra(EXTRA,a);return PendingIntent.getBroadcast(c,id*31+a.hashCode(),i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
 private static void refresh(Context c){AppWidgetManager m=AppWidgetManager.getInstance(c);int[] ids=m.getAppWidgetIds(new android.content.ComponentName(c,FocusWidgetProvider.class));for(int id:ids)m.updateAppWidget(id,views(c,id));}
}
