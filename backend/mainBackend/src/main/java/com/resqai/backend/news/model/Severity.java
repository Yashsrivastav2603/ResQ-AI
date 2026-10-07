package com.resqai.backend.news.model;

/** Maps onto the P0/P1/P2 priority language already used in the Priority Engine. */
public enum Severity {
    GREEN,   // informational
    ORANGE,  // elevated
    RED;     // critical

    public static Severity fromAlertLevel(String alertLevel) {
        if (alertLevel == null) return GREEN;
        return switch (alertLevel.trim().toUpperCase()) {
            case "RED" -> RED;
            case "ORANGE" -> ORANGE;
            default -> GREEN;
        };
    }

    /** USGS PAGER alert levels are green/yellow/orange/red. */
    public static Severity fromPager(String alert, Double magnitude) {
        if (alert != null) {
            return switch (alert.trim().toLowerCase()) {
                case "red" -> RED;
                case "orange", "yellow" -> ORANGE;
                default -> GREEN;
            };
        }
        if (magnitude == null) return GREEN;
        if (magnitude >= 6.0) return RED;
        if (magnitude >= 4.5) return ORANGE;
        return GREEN;
    }
}
