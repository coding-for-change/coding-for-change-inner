import React from 'react';
import { useCmsCollection } from '../../api';
import { CmsEvent } from '../../api/types';
import { RetroLoader } from '../general';

const Events: React.FC = () => {
    const { data: events, loading } = useCmsCollection<CmsEvent>('events');

    if (loading) return <div className="site-page-content"><RetroLoader /></div>;

    const all = events ?? [];
    const upcoming = all.filter(e => e.isUpcoming);
    const past = all.filter(e => !e.isUpcoming);

    return (
        <div className="site-page-content">
            <h1>Events</h1>
            <h3>Workshops, Hackathons & More</h3>
            <br />
            <div className="text-block">
                <p>Join us at our upcoming events or check out what we have been up to!</p>
            </div>
            <br />
            {upcoming.length > 0 && (
                <>
                    <h3>Upcoming Events</h3>
                    <br />
                    <div style={styles.eventsGrid}>
                        {upcoming.map(event => (
                            <div key={event.id} className="big-button-container" style={styles.eventCard}>
                                <div style={styles.eventBadge}>{event.type}</div>
                                <h3>{event.title}</h3>
                                <p style={styles.eventDate}>{event.date} at {event.time}</p>
                                <p style={styles.eventLocation}>{event.location}</p>
                                <br />
                                <p>{event.description}</p>
                                {event.link?.url && (
                                    <>
                                        <br />
                                        <a
                                            href={event.link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.eventLink}
                                        >
                                            {event.link.label || 'Learn More'}
                                        </a>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <br />
                </>
            )}
            {past.length > 0 && (
                <>
                    <h3>Past Events</h3>
                    <br />
                    <div style={styles.eventsGrid}>
                        {past.map(event => (
                            <div key={event.id} className="big-button-container" style={styles.eventCard}>
                                <div style={styles.eventBadge}>{event.type}</div>
                                <h3>{event.title}</h3>
                                <p style={styles.eventDate}>{event.date} at {event.time}</p>
                                <p style={styles.eventLocation}>{event.location}</p>
                                <br />
                                <p>{event.description}</p>
                                {event.link?.url && (
                                    <>
                                        <br />
                                        <a
                                            href={event.link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.eventLink}
                                        >
                                            {event.link.label || 'Learn More'}
                                        </a>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    eventsGrid: {
        flexDirection: 'column',
        width: '100%',
    },
    eventCard: {
        flexDirection: 'column',
        padding: 16,
        marginBottom: 16,
        width: '100%',
        boxSizing: 'border-box',
    },
    eventBadge: {
        backgroundColor: '#008080',
        color: 'white',
        padding: '2px 8px',
        fontSize: 12,
        fontFamily: 'MSSerif',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    eventDate: {
        fontWeight: 'bold',
        marginTop: 4,
    },
    eventLocation: {
        fontStyle: 'italic',
        marginTop: 2,
    },
    eventLink: {
        backgroundColor: '#008080',
        color: 'white',
        padding: '6px 16px',
        fontFamily: 'MSSerif',
        fontSize: 14,
        textDecoration: 'none',
        alignSelf: 'flex-start',
        cursor: 'pointer',
        border: '2px outset #ccc',
    },
};

export default Events;
