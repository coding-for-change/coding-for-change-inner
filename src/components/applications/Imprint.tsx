import React from 'react';
import Window from '../os/Window';
import { siteConfig } from '../../data';

export interface ImprintProps extends WindowAppProps {}

const Imprint: React.FC<ImprintProps> = (props) => {
    return (
        <Window
            top={80}
            left={120}
            width={700}
            height={600}
            windowTitle="Imprint & Privacy Policy"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={siteConfig.copyrightText}
        >
            <div className="site-page" style={styles.container}>
                <div style={styles.content}>
                    <h2>Impressum</h2>
                    <br />
                    <p>
                        <b>Angaben gem. § 5 DDG</b>
                    </p>
                    <br />
                    <p>
                        <b>Coding for Change</b>
                    </p>
                    <p>Montgelasstra&szlig;e 33</p>
                    <p>80538 M&uuml;nchen</p>
                    <br />
                    <p>
                        <b>Vertreten durch:</b>
                    </p>
                    <p>David Franke und Jakob Landbrecht</p>
                    <br />
                    <p>
                        <b>Kontakt:</b>
                    </p>
                    <p>
                        E-Mail:{' '}
                        <a href={`mailto:${siteConfig.email}`}>
                            {siteConfig.email}
                        </a>
                    </p>
                    <br />
                    <p>
                        <b>
                            Verantwortlich f&uuml;r den Inhalt nach § 18 Abs. 2
                            MStV:
                        </b>
                    </p>
                    <p>David Franke und Jakob Landbrecht</p>
                    <p>Montgelasstra&szlig;e 33</p>
                    <p>80538 M&uuml;nchen</p>
                    <br />
                    <p>
                        <b>Haftungsausschluss:</b>
                    </p>
                    <br />
                    <p>
                        <b>Haftung f&uuml;r Inhalte</b>
                    </p>
                    <p>
                        Die Inhalte unserer Seiten wurden mit gr&ouml;&szlig;ter
                        Sorgfalt erstellt. F&uuml;r die Richtigkeit,
                        Vollst&auml;ndigkeit und Aktualit&auml;t der Inhalte
                        k&ouml;nnen wir jedoch keine Gew&auml;hr
                        &uuml;bernehmen. Als Diensteanbieter sind wir
                        gem&auml;&szlig; § 7 Abs. 1 DDG f&uuml;r eigene Inhalte
                        auf diesen Seiten nach den allgemeinen Gesetzen
                        verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
                        Diensteanbieter jedoch nicht verpflichtet,
                        &uuml;bermittelte oder gespeicherte fremde Informationen
                        zu &uuml;berwachen oder nach Umst&auml;nden zu
                        forschen, die auf eine rechtswidrige T&auml;tigkeit
                        hinweisen.
                    </p>
                    <br />
                    <p>
                        <b>Haftung f&uuml;r Links</b>
                    </p>
                    <p>
                        Unser Angebot enth&auml;lt Links zu externen Websites
                        Dritter, auf deren Inhalte wir keinen Einfluss haben.
                        Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte
                        auch keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die
                        Inhalte der verlinkten Seiten ist stets der jeweilige
                        Anbieter oder Betreiber der Seiten verantwortlich. Die
                        verlinkten Seiten wurden zum Zeitpunkt der Verlinkung
                        auf m&ouml;gliche Rechtsverst&ouml;&szlig;e
                        &uuml;berpr&uuml;ft. Rechtswidrige Inhalte waren zum
                        Zeitpunkt der Verlinkung nicht erkennbar.
                    </p>
                    <br />
                    <p>
                        <b>Urheberrecht</b>
                    </p>
                    <p>
                        Die durch die Seitenbetreiber erstellten Inhalte und
                        Werke auf diesen Seiten unterliegen dem deutschen
                        Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung,
                        Verbreitung und jede Art der Verwertung au&szlig;erhalb
                        der Grenzen des Urheberrechtes bed&uuml;rfen der
                        schriftlichen Zustimmung des jeweiligen Autors bzw.
                        Erstellers.
                    </p>
                    <br />
                    <hr style={styles.divider} />
                    <br />
                    <h2>Datenschutzerkl&auml;rung</h2>
                    <br />
                    <h3>1. Verantwortlicher</h3>
                    <br />
                    <p>
                        Verantwortlicher im Sinne der DSGVO ist:
                    </p>
                    <p>Coding for Change</p>
                    <p>Montgelasstra&szlig;e 33, 80538 M&uuml;nchen</p>
                    <p>
                        E-Mail:{' '}
                        <a href={`mailto:${siteConfig.email}`}>
                            {siteConfig.email}
                        </a>
                    </p>
                    <br />
                    <h3>2. Allgemeines zur Datenverarbeitung</h3>
                    <br />
                    <p>
                        Der Schutz Ihrer pers&ouml;nlichen Daten ist uns ein
                        wichtiges Anliegen. Diese Datenschutzerkl&auml;rung
                        informiert Sie dar&uuml;ber, welche Daten beim Besuch
                        unserer Website erhoben werden und wie diese verwendet
                        werden.
                    </p>
                    <br />
                    <h3>3. Hosting</h3>
                    <br />
                    <p>
                        Diese Website wird auf einem Virtual Private Server
                        (VPS) der Hetzner Online GmbH, Industriestr. 25, 91710
                        Gunzenhausen, Deutschland betrieben. Hetzner stellt
                        lediglich die Server-Infrastruktur bereit und
                        verarbeitet dabei im Rahmen des Betriebs
                        personenbezogene Daten (z.B. IP-Adressen) als
                        Auftragsverarbeiter.
                    </p>
                    <br />
                    <p>
                        Der Webserver auf unserem VPS ist so konfiguriert, dass
                        keine zus&auml;tzlichen personenbezogenen Daten (wie
                        Browsertyp, Betriebssystem oder Referrer-URLs) in
                        Log-Dateien gespeichert werden. Die Rechtsgrundlage
                        f&uuml;r die Datenverarbeitung im Rahmen des Hostings
                        ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
                        an einer zuverl&auml;ssigen Bereitstellung der
                        Website).
                    </p>
                    <br />
                    <h3>4. Cookies und Tracking</h3>
                    <br />
                    <p>
                        Diese Website verwendet keine Cookies, Analysetools oder
                        sonstige Tracking-Technologien.
                    </p>
                    <br />
                    <h3>5. Externe Links</h3>
                    <br />
                    <p>
                        Unsere Website kann Links zu externen Websites
                        enthalten. Auf die Inhalte und Datenschutzpraktiken
                        dieser externen Seiten haben wir keinen Einfluss.
                    </p>
                    <br />
                    <h3>6. Ihre Rechte</h3>
                    <br />
                    <p>
                        Sie haben gem&auml;&szlig; DSGVO folgende Rechte
                        bez&uuml;glich Ihrer personenbezogenen Daten:
                    </p>
                    <br />
                    <p>• Recht auf Auskunft (Art. 15 DSGVO)</p>
                    <p>• Recht auf Berichtigung (Art. 16 DSGVO)</p>
                    <p>• Recht auf L&ouml;schung (Art. 17 DSGVO)</p>
                    <p>
                        • Recht auf Einschr&auml;nkung der Verarbeitung (Art.
                        18 DSGVO)
                    </p>
                    <p>
                        • Recht auf Daten&uuml;bertragbarkeit (Art. 20 DSGVO)
                    </p>
                    <p>• Widerspruchsrecht (Art. 21 DSGVO)</p>
                    <br />
                    <p>
                        Zudem haben Sie das Recht, sich bei einer
                        Datenschutz-Aufsichtsbeh&ouml;rde &uuml;ber die
                        Verarbeitung Ihrer personenbezogenen Daten zu
                        beschweren. Die zust&auml;ndige Aufsichtsbeh&ouml;rde
                        ist das Bayerische Landesamt f&uuml;r
                        Datenschutzaufsicht (BayLDA).
                    </p>
                    <br />
                    <h3>7. Kontakt</h3>
                    <br />
                    <p>
                        Bei Fragen zur Datenschutzerkl&auml;rung kontaktieren
                        Sie uns unter{' '}
                        <a href={`mailto:${siteConfig.email}`}>
                            {siteConfig.email}
                        </a>
                        .
                    </p>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 64,
        overflow: 'auto',
    },
    content: {
        width: '85%',
        flexDirection: 'column',
    },
    divider: {
        width: '100%',
        border: 'none',
        borderTop: '1px solid #888',
    },
};

export default Imprint;
