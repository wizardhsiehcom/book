# 附錄｜來源與版本索引

查核日期：2026-09-22。這裡列出正文依據，方便離開研究目錄也能追到原文。F 是現場案例；O／P／W 是官方機制資料卡，不代表本書親自重現。多個連結若是同份手冊或同一事故，不算獨立證據。

## 已用來源

| ID | 原始來源 | 使用位置／證據界線 |
|---|---|---|
| F01 | [TCP socket 連線被清除](https://evan361425.github.io/essay/architecture/tcp-socket-loss-after-dhcp/) | 05，同步日誌；部分原理不採 |
| F02 | [SJ：HTTP 封包除錯](https://blog.toright.com/posts/3442/你也會的-web-http-封包除錯技巧（server-篇）) | 05，縮小擷取；修正介面／HTTP 解釋 |
| F03 | [Julia Evans：DNS diagnosis](https://jvns.ca/blog/2021/11/04/how-do-you-tell-if-a-problem-is-caused-by-dns/) | 03，查實際解析 |
| F04 | [Julia Evans：Wireshark workflow](https://jvns.ca/blog/2018/06/19/what-i-use-wireshark-for/) | 05，存檔回讀、單一連線 |
| F05 | [Cloudflare：PMTU](https://blog.cloudflare.com/path-mtu-discovery-in-practice/) | 08；隧道／ECMP，不泛化純 LAN |
| F06 | [Intel ixgbe #30](https://github.com/intel/ethernet-linux-ixgbe/issues/30) | 01、07；未結案，不採神奇參數 |
| O01 | [curl manual](https://curl.se/docs/manpage.html#--resolve) | 03；單次解析／proxy |
| O02 | [Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2025-ps) | 01、02、11 |
| O03 | [Get-NetTCPConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection?view=windowsserver2025-ps) | 06、11，目的地快照 |
| O04 | [ss 原始手冊](https://raw.githubusercontent.com/iproute2/iproute2/main/man/man8/ss.8) | 02，監聽範圍 |
| O05 | [iperf3 手冊](https://software.es.net/iperf/invoking.html)、[FAQ](https://software.es.net/iperf/faq.html) | 07；Windows 支援限制，同專案不是雙案例 |
| O06 | [Kernel checksum offloads](https://www.kernel.org/doc/html/latest/networking/checksum-offloads.html) | 05；觀察點與機制 |
| O07 | [tcpdump 原始手冊](https://raw.githubusercontent.com/the-tcpdump-group/tcpdump/master/tcpdump.1.in) | 05；-K 不修網路 |
| O08 | [ip-route 手冊鏡像](https://man7.org/linux/man-pages/man8/ip-route.8.html) | 01、08；可追溯原專案文件 |
| P01 | [Python http.server](https://docs.python.org/3/library/http.server.html) | 02、04，固定假回應 |
| P02 | [OpenSSH ssh(1)](https://man.openbsd.org/ssh) | 10，本機轉送 |
| P03 | [netem 手冊](https://man7.org/linux/man-pages/man8/tc-netem.8.html)、[原專案](https://github.com/iproute2/iproute2/blob/main/man/man8/tc-netem.8) | 09；同一文件的轉呈，不計兩筆證據 |
| P04 | [SMB signing](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing) | 11；edition／policy 特定 |
| P05 | [Samba map to guest](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html#MAPTOGUEST) | 11、反例 |
| P06 | [RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html#section-2.1) | F02 的 framing 更正 |
| P07 | [proc_pid_net](https://man7.org/linux/man-pages/man5/proc_pid_net.5.html) | F01 的 /proc 更正 |
| P08 | [curl data-binary](https://curl.se/docs/manpage.html#--data-binary) | 06，與 O01 同文件 |
| P09 | [iperf2 手冊](https://iperf2.sourceforge.io/iperf-manpage.html) | 07，--reverse 與 Windows 短旗標差異 |
| P10 | [Windows ping](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping)、[iputils ping](https://man7.org/linux/man-pages/man8/ping.8.html) | 08；DF／資料長度與兩端旗標 |
| W01 | [tcpdump 原始手冊](https://raw.githubusercontent.com/the-tcpdump-group/tcpdump/master/tcpdump.1.in)、[GNU timeout](https://www.gnu.org/software/coreutils/manual/html_node/timeout-invocation.html) | 05；封包數與時間上限分開 |
| W02 | [Get-SmbClientConfiguration](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbclientconfiguration?view=windowsserver2025-ps)、[Get-SmbConnection](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbconnection?view=windowsserver2025-ps)、[testparm](https://www.samba.org/samba/docs/4.17/man-html/testparm.1.html)、[net use](https://learn.microsoft.com/en-gb/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/gg651155%28v%3Dws.11%29) | 11；設定與實際連線分開，舊版語法需在現場核對 |

| W03 | [ip-netns 手冊](https://man7.org/linux/man-pages/man8/ip-netns.8.html) | 09；Linux-only 隔離練習，不代替 Windows–Linux 對照 |

## 作者、日期與已讀範圍

| ID | 作者／日期 | 本次閱讀與證據強度 |
|---|---|---|
| F01 | evan361425；頁尾有 2023-08-22／2026-02-15，建立與更新角色未確認 | 正文已讀，圖未獨立驗證；採跨日誌方法，根因不背書 |
| F02 | SJ，2013-10-17 | 正文已讀、圖未獨立驗證；修正 -i 與 HTTP 空行的過度概括 |
| F03 | Julia Evans，2021-11-04 | 正文已讀；作者經驗，不是本書實驗 |
| F04 | Julia Evans，2018-06-19 | 正文已讀、圖未獨立驗證；採離線選連線的方法 |
| F05 | Marek Majkowski／Cloudflare，2015-02-04 | 正文與附錄已讀；事故有隧道／ECMP 條件 |
| F06 | logan893，2025-10-28 | issue 正文已讀；未取得維護者根因確認，不能泛化硬體參數 |
| O01、P08 | curl 專案；頁面日期未知 | 對應選項段落，非整份手冊 |
| O02、O03、P04、W02 的 Windows 項目 | Microsoft；除 net use 為 2016-08-31，其他日期未核實 | 語法／範例與相關政策段落；不是所有外連都讀過 |
| O04、O08、P03 | iproute2 專案；頁面日期未核實 | 對應 ss／route／netem 段落；手冊不是本機測試 |
| O05 | ESnet；頁面日期未知 | 使用手冊與 FAQ 的方向／Windows 限制 |
| O06 | Linux kernel 文件團隊；日期未知 | checksum offload 機制段落 |
| O07、W01 | The Tcpdump Group；W01 所讀 master 手冊標 2026-07-31 | 指定旗標與擷取統計；分支會變動，不當作鎖版 |
| P01 | Python Software Foundation／文件團隊；頁面日期未知，查閱版 3.14.7 | CLI、安全說明及第 06 章所需 handler API；主線不依賴 3.14 新 TLS 功能 |
| P02 | OpenBSD／OpenSSH；日期未核實 | -L、-N、bind 與主機金鑰段落 |
| P05、W02 的 testparm | Samba Team；日期未知 | map to guest 條目、testparm 描述／選項；testparm 連結版為 4.17.0pre |
| P06 | Fielding、Nottingham、Reschke，2022-06 | RFC 9112 §2.1 訊息格式 |
| P07 | Linux man-pages 專案；日期未核實 | /proc 網路資訊的描述 |
| P09 | iperf2 專案；頁面日期未知 | 基本旗標、reverse、Windows 特例；Windows binary 未執行 |
| P10 | Microsoft，2024-11-01；iputils 日期未核實 | 兩端 ping 的 DF、大小、次數選項 |
| W01 的 timeout | GNU Coreutils／FSF；日期未知 | duration、signal、kill-after 與退出碼 |

W03：Eric W. Biederman，修訂 Nicolas Dichtel；手冊頁尾 2013-01-16。已讀 add／exec／delete 與 loopback 範例，未執行。

## 沒有採用的說法

「關掉 checksum 檢查就修好網路」混淆顯示與線上封包；「ping 通就代表應用正常」沒有測協定與身份；「Bad User 就是錯密碼降成 guest」與 Samba 條目不符；「Windows 11 的 signing 預設全相同」漏掉 edition 與政策。正文把這些放成判讀反例，不提供通用關閉設定的處方。

搜尋中另有 Microsoft iperf3 部落格未取得正文、中文 Samba 搜尋片段未取得正文、GSLin 網頁受 robots 限制；它們只作未讀線索，不支持本書技術結論。研究保存的是繁中資料卡與英文原始連結，不是來源全文轉載。

## 接下來要補的是實測

優先補一台 Windows＋Linux 的第 04／02／01 章三態紀錄，再補可信 TLS 名稱、Windows iperf2 發行檔、netem 獨立介面與既有 Samba 測試共享。沒有測到的地方保留為 H 實驗設計，不能用更多來源連結抵掉。詳見 [驗證紀錄](appendix-validation.md)。
