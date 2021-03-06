drop database if exists `example_auth`;
create database `example_auth`;
use `example_auth`;

create table `users` (
  `id` int not null auto_increment,
  `username` varchar(100) not null,
  `email` varchar(100) not null,
  `password_hash` varchar(64) not null,
  `is_admin` boolean not null default(0),
  `is_moderator` boolean not null default(0),
  `is_email_verified` boolean not null default(0),
  `lastLogin` datetime null,
  primary key (`id`),
  unique (`username`),
  unique (`email`)
);

insert into users (id, username, email, password_hash, is_admin) values (1, 'paul.smith', 'admin@example.com', '$2b$10$DlK0HorlZ0XtdAux86ASO.XbW2NPM8w.4GpLpZ6z9vksVNGSAB0h6', 1);
insert into users (id, username, email, password_hash, is_moderator) values (2, 'john.doe', 'mod@example.com', '$2b$10$DlK0HorlZ0XtdAux86ASO.XbW2NPM8w.4GpLpZ6z9vksVNGSAB0h6', 1);
insert into users (id, username, email, password_hash) values (3, 'jane.doe', 'user@example.com', '$2b$10$DlK0HorlZ0XtdAux86ASO.XbW2NPM8w.4GpLpZ6z9vksVNGSAB0h6');
insert into users (id, username, email, password_hash) values (4, 'croath3', 'cwaslin3@twitpic.com', 'pSrOSyNmIy');
insert into users (id, username, email, password_hash) values (5, 'glangabeer4', 'hpye4@spiegel.de', 'qq5VEhpNT');
insert into users (id, username, email, password_hash) values (6, 'kadamthwaite5', 'mfarrow5@arstechnica.com', 'PWk4aWsxqyRW');
insert into users (id, username, email, password_hash) values (7, 'jbeaument6', 'hjizhaki6@google.com.hk', 'ChcOy55T0cy');
insert into users (id, username, email, password_hash) values (8, 'tpottage7', 'scapin7@parallels.com', 'IednGt');
insert into users (id, username, email, password_hash) values (9, 'rchapier8', 'araymen8@usnews.com', 't73qGyENX5');
insert into users (id, username, email, password_hash) values (10, 'zfinci9', 'wcamacke9@mayoclinic.com', 'MV3AHGt');
insert into users (id, username, email, password_hash) values (11, 'laupola', 'hjeppa@xinhuanet.com', 'OmMTsTlwOr');
insert into users (id, username, email, password_hash) values (12, 'wiversb', 'slindbergb@loc.gov', 'hPsiEM4KA');
insert into users (id, username, email, password_hash) values (13, 'kocurriganc', 'jrenforthc@omniture.com', 'vcxzGiOFM');
insert into users (id, username, email, password_hash) values (14, 'spallentd', 'vlyenyngd@nationalgeographic.com', 'k8S8YgUhl');
insert into users (id, username, email, password_hash) values (15, 'fdjurevice', 'garlte@dmoz.org', '3YmzJnosF');
insert into users (id, username, email, password_hash) values (16, 'bguppeyf', 'nmackimf@cornell.edu', 'hJd5n3t');
insert into users (id, username, email, password_hash) values (17, 'lropertg', 'pvasyatking@oaic.gov.au', 'cdxiLJ');
insert into users (id, username, email, password_hash) values (18, 'vjobsonh', 'ppoulstonh@techcrunch.com', 'gqB88iHvdqM');
insert into users (id, username, email, password_hash) values (19, 'mturneuxi', 'dpiresi@constantcontact.com', 'ucMDZWTf');
insert into users (id, username, email, password_hash) values (20, 'bcanaj', 'afilippoj@posterous.com', 'ENrwcQ5');
insert into users (id, username, email, password_hash) values (21, 'mevendenk', 'wgantleyk@surveymonkey.com', 'JJUeBjLTVJ');
insert into users (id, username, email, password_hash) values (22, 'lahmedl', 'pbrightiel@slashdot.org', '7D0sVKUUkkr');
insert into users (id, username, email, password_hash) values (23, 'mjakom', 'ailyasovm@eventbrite.com', 'yoPmrP3J');
insert into users (id, username, email, password_hash) values (24, 'anasseyn', 'hgerhartzn@devhub.com', '59WUtuhY');
insert into users (id, username, email, password_hash) values (25, 'sturmello', 'rmagrannello@plala.or.jp', 'BgQs9FuG');
insert into users (id, username, email, password_hash) values (26, 'klambshinep', 'smillwaterp@nih.gov', '7NQ1rcafOm');
insert into users (id, username, email, password_hash) values (27, 'talelsandrovichq', 'ogroucuttq@cloudflare.com', 'DSYGSZl6');
insert into users (id, username, email, password_hash) values (28, 'sroer', 'bkupkerr@sina.com.cn', '46awqGyMY');
insert into users (id, username, email, password_hash) values (29, 'chantuschs', 'rhowlins@sun.com', 'sMs104WV0');
insert into users (id, username, email, password_hash) values (30, 'mpulequet', 'wdelvest@springer.com', '0nLdJsH');
insert into users (id, username, email, password_hash) values (31, 'lhubandu', 'afurlongeu@reference.com', 'q2QEJ2i');
insert into users (id, username, email, password_hash) values (32, 'biacopiniv', 'jtillv@dell.com', '08yvtqV');
insert into users (id, username, email, password_hash) values (33, 'rshalcrasw', 'atatamw@prweb.com', 'Aq2v2aG');
insert into users (id, username, email, password_hash) values (34, 'ejovasevicx', 'ohuyghex@adobe.com', 'WsLz94CndfX');
insert into users (id, username, email, password_hash) values (35, 'mgourdony', 'abonwelly@marriott.com', '0E28MfQ8ephp');
insert into users (id, username, email, password_hash) values (36, 'waspinalz', 'ylangthornez@mozilla.org', 'DNIHLHkvTJ');
insert into users (id, username, email, password_hash) values (37, 'amervyn10', 'mgentsch10@gnu.org', 'CpYPn32z');
insert into users (id, username, email, password_hash) values (38, 'kbarnsdall11', 'crayne11@timesonline.co.uk', 'vulElxvbZev');
insert into users (id, username, email, password_hash) values (39, 'dbrazenor12', 'cmaylott12@linkedin.com', 'u33P70c');
insert into users (id, username, email, password_hash) values (40, 'jgladeche13', 'dframpton13@skyrock.com', 'h9RhPfqOPr');
insert into users (id, username, email, password_hash) values (41, 'ndanser14', 'ycogman14@spiegel.de', 'YTyRuyNp');
insert into users (id, username, email, password_hash) values (42, 'wcrame15', 'dcrebo15@wix.com', 'p5EhmNvSUD');
insert into users (id, username, email, password_hash) values (43, 'jguilloux16', 'mritchman16@scribd.com', 'b8PdhYJDEB');
insert into users (id, username, email, password_hash) values (44, 'tpavlenko17', 'gjaume17@google.ru', 'jxTiWOzArGB');
insert into users (id, username, email, password_hash) values (45, 'sfitzhenry18', 'mkent18@utexas.edu', 'RP095SH0g');
insert into users (id, username, email, password_hash) values (46, 'dmasi19', 'lberesfore19@intel.com', 'JaM2KQ6Q');
insert into users (id, username, email, password_hash) values (47, 'vdambrosi1a', 'gheigl1a@printfriendly.com', 'tKVWZ5');
insert into users (id, username, email, password_hash) values (48, 'sdettmar1b', 'ncryer1b@ucoz.com', 'O7tgbDlII7Vb');
insert into users (id, username, email, password_hash) values (49, 'mcaskey1c', 'ghafner1c@example.com', 'g2K0v4Gklvv');
insert into users (id, username, email, password_hash) values (50, 'vgrabb1d', 'msennett1d@wsj.com', 'P1pAprie');
insert into users (id, username, email, password_hash) values (51, 'kdoutch1e', 'adyke1e@ehow.com', 'Be0QcHfZ');
insert into users (id, username, email, password_hash) values (52, 'ldorricott1f', 'dfranek1f@cnet.com', 'Qhr7ePYpNlP');
insert into users (id, username, email, password_hash) values (53, 'csturm1g', 'danscombe1g@elegantthemes.com', '47vkmTQr');
insert into users (id, username, email, password_hash) values (54, 'nespie1h', 'gbraganca1h@etsy.com', 'OMIGai');
insert into users (id, username, email, password_hash) values (55, 'jlush1i', 'mandre1i@odnoklassniki.ru', 'E6KDxNB');
insert into users (id, username, email, password_hash) values (56, 'lreskelly1j', 'ssterte1j@usgs.gov', 'GYrlgyGInVm');
insert into users (id, username, email, password_hash) values (57, 'smarven1k', 'nmcturley1k@google.com.br', '4QKYFbR');
insert into users (id, username, email, password_hash) values (58, 'ciori1l', 'khanbidge1l@purevolume.com', 'BJRcj5jBOcDn');
insert into users (id, username, email, password_hash) values (59, 'elindfors1m', 'jredmond1m@google.com.au', 'SLs0L7');
insert into users (id, username, email, password_hash) values (60, 'fhaggerstone1n', 'jbassham1n@gov.uk', 'AegAjQW');
insert into users (id, username, email, password_hash) values (61, 'lkopke1o', 'jholleworth1o@ehow.com', 'sYysVeqc0QD');
insert into users (id, username, email, password_hash) values (62, 'nbrunsdon1p', 'dsirl1p@google.cn', 'Cb6w66');
insert into users (id, username, email, password_hash) values (63, 'etimperley1q', 'klawrenson1q@edublogs.org', '07MvLWzFjVG');
insert into users (id, username, email, password_hash) values (64, 'minnis1r', 'mallcorn1r@umn.edu', '3Y5HRm');
insert into users (id, username, email, password_hash) values (65, 'rmusselwhite1s', 'imosedill1s@amazon.co.uk', '0t0HsDwxY');
insert into users (id, username, email, password_hash) values (66, 'kgreeveson1t', 'nstruijs1t@parallels.com', 'uD9a9K8R0');
insert into users (id, username, email, password_hash) values (67, 'ewarrior1u', 'wfranceschi1u@symantec.com', 'mOPsTS4');
insert into users (id, username, email, password_hash) values (68, 'abroster1v', 'hkeets1v@wix.com', 'ADVfNx');
insert into users (id, username, email, password_hash) values (69, 'ejarmain1w', 'mkrebs1w@deliciousdays.com', 'x2X7Sbw4BJ4');
insert into users (id, username, email, password_hash) values (70, 'mollett1x', 'ssteljes1x@tripod.com', 'NQ309U3ie6aQ');
insert into users (id, username, email, password_hash) values (71, 'ddominelli1y', 'nparagreen1y@trellian.com', 'gHMZe1YRI');
insert into users (id, username, email, password_hash) values (72, 'lterrey1z', 'ndearell1z@businessweek.com', 'uzMptQP');
insert into users (id, username, email, password_hash) values (73, 'jarend20', 'jtaillant20@census.gov', 'xGlggv');
insert into users (id, username, email, password_hash) values (74, 'ecasperri21', 'dferruzzi21@prlog.org', '9a60q126qx');
insert into users (id, username, email, password_hash) values (75, 'krumming22', 'gfownes22@oakley.com', 'gqNQBdnRK');
insert into users (id, username, email, password_hash) values (76, 'bhumphery23', 'scomley23@utexas.edu', 'ke8DcBzi3');
insert into users (id, username, email, password_hash) values (77, 'gtudor24', 'khugett24@weather.com', 'lDNzOZcqBjoZ');
insert into users (id, username, email, password_hash) values (78, 'ubartolomeoni25', 'tvidean25@bravesites.com', 'EcyHcXTZSDH');
insert into users (id, username, email, password_hash) values (79, 'rtoquet26', 'sclifford26@independent.co.uk', '1bubOSC1X');
insert into users (id, username, email, password_hash) values (80, 'ffairbrother27', 'bmacpaik27@mayoclinic.com', 'FWO51Kw9');
insert into users (id, username, email, password_hash) values (81, 'pstobbart28', 'lvarnals28@marriott.com', '9c0Tzh');
insert into users (id, username, email, password_hash) values (82, 'dwogden29', 'rdarragon29@blogspot.com', 'tuSTHtTXxz0');
insert into users (id, username, email, password_hash) values (83, 'ghall2a', 'gdurning2a@amazon.com', 'jzwE8JH');
insert into users (id, username, email, password_hash) values (84, 'gseabridge2b', 'hwhitrod2b@ovh.net', 'd6YIfB0');
insert into users (id, username, email, password_hash) values (85, 'cdowson2c', 'nkarolczyk2c@twitter.com', 'SS9cx9hnA14');
insert into users (id, username, email, password_hash) values (86, 'ypirt2d', 'mkirwood2d@moonfruit.com', 'Ohgb4Jy');
insert into users (id, username, email, password_hash) values (87, 'jdancy2e', 'lsalomon2e@ucla.edu', 'K13aeIlN');
insert into users (id, username, email, password_hash) values (88, 'rsaunt2f', 'aritchings2f@hao123.com', 'k8HiN4ZfqKmS');
insert into users (id, username, email, password_hash) values (89, 'adraijer2g', 'cfoxcroft2g@nature.com', 'E5zwgtSmq');
insert into users (id, username, email, password_hash) values (90, 'ccregg2h', 'iacory2h@nymag.com', 'JXof0uQZuzwa');
insert into users (id, username, email, password_hash) values (91, 'jhammerson2i', 'gpawlaczyk2i@sohu.com', 'TJwDlIXb');
insert into users (id, username, email, password_hash) values (92, 'rcoucha2j', 'hhens2j@homestead.com', 'T9apguo');
insert into users (id, username, email, password_hash) values (93, 'egorton2k', 'psimonutti2k@bluehost.com', 'e1mr0El');
insert into users (id, username, email, password_hash) values (94, 'mscadding2l', 'dpetersen2l@berkeley.edu', 'Aznlbh7hJmSA');
insert into users (id, username, email, password_hash) values (95, 'estoffel2m', 'ehowsam2m@mysql.com', 'jsHkXUbiq');
insert into users (id, username, email, password_hash) values (96, 'ssafont2n', 'brudeyeard2n@biblegateway.com', '3c3j25v');
insert into users (id, username, email, password_hash) values (97, 'esmallcombe2o', 'fduddan2o@usatoday.com', '5HLloZ1D');
insert into users (id, username, email, password_hash) values (98, 'ldeverell2p', 'gtomney2p@bandcamp.com', 'TTQt8Iia');
insert into users (id, username, email, password_hash) values (99, 'tpearman2q', 'hvatcher2q@xing.com', 'k0khvgJGfGL5');
insert into users (id, username, email, password_hash) values (100, 'wburgin2r', 'ismedmoor2r@tinyurl.com', 'O2ZlzM');

select * from users;

