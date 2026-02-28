// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "motchill",
        "name": "MotChill",
        "version": "2.0.0",
        "baseUrl": "https://motchillz.cx",
        "iconUrl": "https://motchillz.cx/motchill.png",
        "isEnabled": true,
        "isAdult": false,
        "type": "MOVIE",
        "layoutType": "VERTICAL"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'danh-sach/phim-bo', title: 'PHIM BỘ MỚI', type: 'Horizontal' },
        { slug: 'danh-sach/phim-le', title: 'PHIM LẺ MỚI', type: 'Horizontal' },
        { slug: 'danh-sach/phim-chieu-rap', title: 'PHIM CHIẾU RẠP', type: 'Horizontal' },
        { slug: 'the-loai/hoat-hinh', title: 'PHIM HOẠT HÌNH', type: 'Horizontal' },
        { slug: 'the-loai/hanh-dong', title: 'Hành Động', type: 'Horizontal' },
        { slug: 'the-loai/tinh-cam', title: 'Tình Cảm', type: 'Horizontal' },
        { slug: 'the-loai/kinh-di', title: 'Kinh Dị', type: 'Grid' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Phim Bộ', slug: 'phim-bo' },
        { name: 'Phim Lẻ', slug: 'phim-le' },
        { name: 'Chiếu Rạp', slug: 'phim-chieu-rap' },
        { name: 'Hành Động', slug: 'hanh-dong' },
        { name: 'Hoạt Hình', slug: 'hoat-hinh' },
        { name: 'Tình Cảm', slug: 'tinh-cam' },
        { name: 'Kinh Dị', slug: 'kinh-di' },
        { name: 'Cổ Trang', slug: 'co-trang' },
        { name: 'Hài Hước', slug: 'hai-huoc' },
        { name: 'Võ Thuật', slug: 'vo-thuat' },
        { name: 'Viễn Tưởng', slug: 'vien-tuong' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        category: [
            { name: "Hành Động", value: "hanh-dong" },
            { name: "Tình Cảm", value: "tinh-cam" },
            { name: "Hài Hước", value: "hai-huoc" },
            { name: "Cổ Trang", value: "co-trang" },
            { name: "Tâm Lý", value: "tam-ly" },
            { name: "Hình Sự", value: "hinh-su" },
            { name: "Võ Thuật", value: "vo-thuat" },
            { name: "Viễn Tưởng", value: "vien-tuong" },
            { name: "Kinh Dị", value: "kinh-di" },
            { name: "Hoạt Hình", value: "hoat-hinh" },
            { name: "Phiêu Lưu", value: "phieu-luu" },
            { name: "Âm Nhạc", value: "am-nhac" }
        ],
        country: [
            { name: "Trung Quốc", value: "trung-quoc" },
            { name: "Hàn Quốc", value: "han-quoc" },
            { name: "Nhật Bản", value: "nhat-ban" },
            { name: "Thái Lan", value: "thai-lan" },
            { name: "Âu Mỹ", value: "au-my" },
            { name: "Đài Loan", value: "dai-loan" },
            { name: "Hồng Kông", value: "hong-kong" },
            { name: "Ấn Độ", value: "an-do" }
        ],
        year: [
            { name: "2026", value: "2026" },
            { name: "2025", value: "2025" },
            { name: "2024", value: "2024" },
            { name: "2023", value: "2023" },
            { name: "2022", value: "2022" },
            { name: "2021", value: "2021" },
            { name: "2020", value: "2020" }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        var baseUrl = "https://motchillz.cx";

        // Nếu filter có category/country/year thì ghi đè slug
        if (filters.category) {
            slug = "the-loai/" + filters.category;
        }
        if (filters.country) {
            slug = "quoc-gia/" + filters.country;
        }
        if (filters.year) {
            slug = "nam-phat-hanh/" + filters.year;
        }

        // Nếu slug đã chứa prefix path (vd: "danh-sach/phim-bo") thì dùng luôn
        var finalUrl = baseUrl;
        if (slug.indexOf("/") > -1) {
            finalUrl += "/" + slug;
        } else {
            // Mặc định: danh-sach
            finalUrl += "/danh-sach/" + slug;
        }

        // MotchillZ phân trang bằng path: /danh-sach/phim-bo/2
        if (page > 1) {
            finalUrl += "/" + page;
        }

        return finalUrl;
    } catch (e) {
        return "https://motchillz.cx/danh-sach/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var url = "https://motchillz.cx/tim-kiem/" + encodeURIComponent(keyword);
    if (page > 1) url += "/" + page;
    return url;
}

function getUrlDetail(slug) {
    if (!slug) return "https://motchillz.cx/";
    // Nếu slug đã là URL đầy đủ (dùng cho episode id)
    if (slug.indexOf("http") === 0) return slug;
    // Nếu slug đã bắt đầu bằng /phim/ (đường dẫn tuyệt đối)
    if (slug.indexOf("/phim/") === 0) return "https://motchillz.cx" + slug;
    // Mặc định: ghép vào /phim/
    return "https://motchillz.cx/phim/" + slug;
}

function getUrlCategories() { return "https://motchillz.cx/"; }
function getUrlCountries() { return "https://motchillz.cx/"; }
function getUrlYears() { return "https://motchillz.cx/"; }

// =============================================================================
// UTILS
// =============================================================================

var PluginUtils = {
    cleanText: function (text) {
        if (!text) return "";
        return text.replace(/<[^>]*>/g, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\s+/g, " ")
            .trim();
    }
};

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    var moviesMap = {};

    // Mỗi phim nằm trong 1 card group:
    // <div class="group ..."><a title="TITLE" ... href="/phim/SLUG">
    //   <img alt="..." src="THUMB"/>
    //   <span>Vietsub</span> <span>HD</span>
    //   <span>Hoàn tất (16/16)</span> hoặc <span>Tập 8/24</span>
    //   <h3>TITLE</h3>
    // </a></div>

    var cardRegex = /<a\s+title="([^"]+)"[^>]*class="block[^"]*"[^>]*href="\/phim\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    var match;

    while ((match = cardRegex.exec(html)) !== null) {
        var title = PluginUtils.cleanText(match[1]);
        var slug = match[2];
        var cardHtml = match[3];

        if (!slug || moviesMap[slug]) continue;

        // Ảnh thumb
        var thumbMatch = cardHtml.match(/<img[^>]*src="([^"]+)"/i);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        // Ngôn ngữ: Vietsub hoặc Lồng Tiếng
        var langMatch = cardHtml.match(/<span[^>]*bg-black\/70[^>]*>[^<]*<\/span>/i);
        var lang = "Vietsub";
        if (langMatch) {
            var langText = PluginUtils.cleanText(langMatch[0]);
            if (langText) lang = langText;
        }

        // Chất lượng: HD
        var qualityMatch = cardHtml.match(/<span[^>]*bg-yellow[^>]*>([^<]+)<\/span>/i);
        var quality = qualityMatch ? PluginUtils.cleanText(qualityMatch[1]) : "HD";

        // Tập phim: nằm trong <span> ở bottom-1 left-1
        // VD: "Hoàn tất (16/16)" hoặc "Tập 8<!-- -->/<!-- -->24" hoặc "Trailer"
        var epMatch = cardHtml.match(/<div[^>]*bottom-1[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/i);
        var episode = "Full";
        if (epMatch) {
            episode = PluginUtils.cleanText(epMatch[1]);
        }

        moviesMap[slug] = {
            id: slug,
            title: title,
            posterUrl: thumb,
            backdropUrl: thumb,
            year: 0,
            quality: quality,
            episode_current: episode || "Full",
            lang: lang
        };
    }

    // Fallback: nếu regex trên không match (trang search hoặc cấu trúc khác)
    if (Object.keys(moviesMap).length === 0) {
        var fallbackRegex = /<a[^>]+href="\/phim\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        var fbMatch;
        while ((fbMatch = fallbackRegex.exec(html)) !== null) {
            var fbSlug = fbMatch[1];
            // Bỏ qua link tập phim trực tiếp
            if (fbSlug.indexOf("tap-") > -1) continue;
            if (moviesMap[fbSlug]) continue;

            var fbHtml = fbMatch[2];
            var fbTitleMatch = fbHtml.match(/<h3[^>]*>(.*?)<\/h3>/i) ||
                fbHtml.match(/alt="([^"]+)"/i) ||
                fbHtml.match(/title="([^"]+)"/i);
            var fbTitle = fbTitleMatch ? PluginUtils.cleanText(fbTitleMatch[1]) : "";

            var fbThumbMatch = fbHtml.match(/<img[^>]*src="([^"]+)"/i);
            var fbThumb = fbThumbMatch ? fbThumbMatch[1] : "";

            if (fbTitle || fbThumb) {
                moviesMap[fbSlug] = {
                    id: fbSlug,
                    title: fbTitle || fbSlug,
                    posterUrl: fbThumb,
                    backdropUrl: fbThumb,
                    year: 0,
                    quality: "HD",
                    episode_current: "Full",
                    lang: "Vietsub"
                };
            }
        }
    }

    // Phân trang: motchillz dùng path segments, vd /danh-sach/phim-bo/717
    // Chỉ lấy từ link phân trang (danh-sach, the-loai, quoc-gia, tim-kiem), BỎ QUA /nam-phat-hanh/
    var totalPages = 1;
    var pageRegex = /href="\/(danh-sach|the-loai|quoc-gia|tim-kiem)\/[^"]*\/(\d+)"/g;
    var pgMatch;
    while ((pgMatch = pageRegex.exec(html)) !== null) {
        var p = parseInt(pgMatch[2]);
        if (p > totalPages && p < 10000) totalPages = p;
    }

    var movies = [];
    for (var key in moviesMap) {
        if (moviesMap.hasOwnProperty(key)) {
            movies.push(moviesMap[key]);
        }
    }

    return JSON.stringify({
        items: movies,
        pagination: {
            currentPage: 1,
            totalPages: totalPages,
            totalItems: movies.length,
            itemsPerPage: 20
        }
    });
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    try {
        // Tiêu đề phim
        var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        var title = titleMatch ? PluginUtils.cleanText(titleMatch[1]) : "";

        // ID (slug) từ canonical hoặc og:url
        var id = "";
        var canonicalMatch = html.match(/href="[^"]*\/phim\/([^"\/]+)"/i) ||
            html.match(/content="[^"]*\/phim\/([^"\/]+)"/i);
        if (canonicalMatch) id = canonicalMatch[1];

        // Mô tả
        var descMatch = html.match(/<div[^>]*class="[^"]*prose[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
        var description = descMatch ? PluginUtils.cleanText(descMatch[1]) : "";

        // Ảnh poster từ og:image
        var thumbMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
        var thumb = thumbMatch ? thumbMatch[1] : "";
        // Fallback: tìm ảnh đầu tiên từ static.aircms.xyz
        if (!thumb) {
            var imgMatch = html.match(/src="(https:\/\/static\.aircms\.xyz[^"]+)"/i);
            if (imgMatch) thumb = imgMatch[1];
        }

        // Metadata: Đạo diễn, Diễn viên, Quốc gia, Năm, Thể loại, Thời lượng
        var director = "";
        var casts = "";
        var country = "";
        var year = 0;
        var category = "";
        var duration = "";
        var rating = 0;

        // Nhiều thông tin nằm trong __next_f.push payloads
        var nextChunks = "";
        var nextRegex = /<script>self\.__next_f\.push\(\[1,"([^"]+)"\]\)<\/script>/g;
        var nMatch;
        while ((nMatch = nextRegex.exec(html)) !== null) {
            nextChunks += nMatch[1];
        }
        // Unescape
        nextChunks = nextChunks.replace(/\\"/g, '"').replace(/\\n/g, " ").replace(/\\\\/g, "\\");

        // Tìm metadata trong cả HTML gốc và nextChunks
        var searchStr = html + " " + nextChunks;

        // Đạo diễn
        var dirMatch = searchStr.match(/Đạo diễn[:\s]*<\/[^>]+>\s*([\s\S]*?)(?:<\/|$)/i) ||
            searchStr.match(/Đạo diễn[:\s]+([^<\n]+)/i);
        if (dirMatch) director = PluginUtils.cleanText(dirMatch[1]);

        // Diễn viên
        var castMatch = searchStr.match(/Diễn viên[:\s]*<\/[^>]+>\s*([\s\S]*?)(?:<\/|$)/i) ||
            searchStr.match(/Diễn viên[:\s]+([^<\n]+)/i);
        if (castMatch) casts = PluginUtils.cleanText(castMatch[1]);

        // Quốc gia
        var countryMatch = searchStr.match(/Quốc gia[:\s]*<\/[^>]+>\s*([\s\S]*?)(?:<\/|$)/i) ||
            searchStr.match(/Quốc gia[:\s]+([^<\n]+)/i);
        if (countryMatch) country = PluginUtils.cleanText(countryMatch[1]);

        // Năm
        var yearMatch = searchStr.match(/Năm[:\s]*(\d{4})/i) ||
            searchStr.match(/Năm phát hành[:\s]*(\d{4})/i);
        if (yearMatch) year = parseInt(yearMatch[1]) || 0;

        // Thể loại
        var catMatch = searchStr.match(/Thể loại[:\s]*<\/[^>]+>\s*([\s\S]*?)(?:<\/|$)/i) ||
            searchStr.match(/Thể loại[:\s]+([^<\n]+)/i);
        if (catMatch) category = PluginUtils.cleanText(catMatch[1]);

        // Thời lượng
        var durMatch = searchStr.match(/Thời lượng[:\s]+([^<\n]+)/i);
        if (durMatch) duration = PluginUtils.cleanText(durMatch[1]);

        // Rating
        var ratingMatch = searchStr.match(/(\d+\.?\d*)\s*\/\s*10/i);
        if (ratingMatch) rating = parseFloat(ratingMatch[1]) || 0;

        // === EPISODES ===
        // Trên trang detail, các tập phim nằm trong <a href="/phim/slug/tap-X">
        var epsArr = [];
        var seenUrls = {};
        var epRegex = /<a[^>]+href="(\/phim\/[^"]*tap-[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
        var epMatch2;

        while ((epMatch2 = epRegex.exec(html)) !== null) {
            var epPath = epMatch2[1];
            var epLabel = PluginUtils.cleanText(epMatch2[2]);

            // Lọc tên tập -> chỉ giữ số hoặc "Full"
            if (!epLabel || epLabel.indexOf("<svg") > -1) {
                var tMatch = epPath.match(/tap-(\d+)/);
                epLabel = tMatch ? "Tập " + tMatch[1] : "Xem Phim";
            }

            if (!seenUrls[epPath]) {
                // id phải là FULL URL để VAAPP fetch HTML trang tập phim
                var fullEpUrl = "https://motchillz.cx" + epPath;
                epsArr.push({
                    id: fullEpUrl,
                    name: epLabel,
                    slug: epLabel
                });
                seenUrls[epPath] = true;
            }
        }

        // Nếu chỉ tìm được ít tập, thử parse từ NextJS data cho phim bộ nhiều tập
        // MotchillZ giấu danh sách tập trong __next_f.push payloads
        if (id) {
            // Tạo regex tìm tất cả tap-N cho slug này
            var slugBase = id.replace(/\d+$/, '').replace(/-$/, '');
            // Tìm pattern: /phim/SLUG/tap-N  
            var tapPattern = new RegExp('\/phim\/' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\/tap-(\\d+)', 'gi');
            var allSrc = html + nextChunks;
            var tapMatch2;
            while ((tapMatch2 = tapPattern.exec(allSrc)) !== null) {
                var tapNum = parseInt(tapMatch2[1]);
                var tapPath = '/phim/' + id + '/tap-' + tapNum;
                if (!seenUrls[tapPath]) {
                    epsArr.push({
                        id: 'https://motchillz.cx' + tapPath,
                        name: 'Tập ' + tapNum,
                        slug: 'tap-' + tapNum
                    });
                    seenUrls[tapPath] = true;
                }
            }
            // Sắp xếp theo số tập
            epsArr.sort(function (a, b) {
                var na = parseInt(a.slug.replace('tap-', '')) || 0;
                var nb = parseInt(b.slug.replace('tap-', '')) || 0;
                return na - nb;
            });
        }

        // Fallback cho phim lẻ: tìm link "Xem Phim" / play button
        if (epsArr.length === 0) {
            var playMatch = html.match(/<a[^>]+href="(\/phim\/[^"]+)"[^>]*>[^<]*(?:Xem Phim|Xem Ngay|Play|Full)[^<]*<\/a>/i) ||
                html.match(/<a[^>]+href="(\/phim\/[^"]*full[^"]*)"/i);
            if (playMatch) {
                epsArr.push({
                    id: "https://motchillz.cx" + playMatch[1],
                    name: "Full",
                    slug: "full"
                });
            }
        }

        var servers = [];
        if (epsArr.length > 0) {
            servers.push({
                name: "MotChill",
                episodes: epsArr
            });
        } else {
            // Tạm thời trả về Trailer nếu không tìm ra tập nào
            servers.push({
                name: "MotChill",
                episodes: [{
                    id: "",
                    name: "Trailer",
                    slug: "trailer"
                }]
            });
        }

        // Xác định trạng thái
        var statusMatch = html.match(/Hoàn tất|Trailer|Tập\s+\d+|Full/i);
        var status = statusMatch ? statusMatch[0] : "Full";

        return JSON.stringify({
            id: id,
            title: title || "Chưa có tiêu đề",
            posterUrl: thumb,
            backdropUrl: thumb,
            description: description,
            servers: servers,
            quality: "HD",
            lang: "Vietsub",
            year: year,
            rating: rating,
            casts: casts,
            director: director,
            country: country,
            category: category,
            status: status,
            duration: duration
        });
    } catch (e) {
        return "null";
    }
}

function parseDetailResponse(html, fallbackUrl) {
    try {
        var m3u8Link = "";

        // 1. Tìm m3u8 trực tiếp trong script tags
        var scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        var sMatch;
        while ((sMatch = scriptRegex.exec(html)) !== null) {
            var content = sMatch[1];
            // Tìm link m3u8 (opstream90, vip.opstream, etc.)
            if (content.indexOf('.m3u8') > -1) {
                var linkRegex = /https?:\/\/[^\s"'\\]+\.m3u8/gi;
                var links = content.match(linkRegex);
                if (links && links.length > 0) {
                    m3u8Link = links[0];
                    break;
                }
            }
        }

        // 2. Tìm trong __next_f.push payload
        if (!m3u8Link) {
            var nextRegex = /<script>self\.__next_f\.push\(\[1,"([^"]+)"\]\)<\/script>/g;
            var nMatch;
            while ((nMatch = nextRegex.exec(html)) !== null) {
                var data = nMatch[1];
                if (data.indexOf('.m3u8') > -1) {
                    var m3u8Regex = /https?:\\?\/\\?\/[^\s"'\\]*\.m3u8/gi;
                    var m3u8Links = data.match(m3u8Regex);
                    if (m3u8Links && m3u8Links.length > 0) {
                        m3u8Link = m3u8Links[0].replace(/\\\//g, "/");
                        break;
                    }
                }
            }
        }

        // 3. Tìm iframe embed
        if (!m3u8Link) {
            var iframeMatch = html.match(/<iframe[^>]*src="([^"]+)"/i);
            if (iframeMatch) {
                var iframeUrl = iframeMatch[1];
                // Bỏ qua facebook, youtube, google
                if (iframeUrl.indexOf("facebook") === -1 &&
                    iframeUrl.indexOf("youtube") === -1 &&
                    iframeUrl.indexOf("google") === -1) {
                    if (iframeUrl.indexOf("//") === 0) iframeUrl = "https:" + iframeUrl;
                    return JSON.stringify({
                        url: iframeUrl,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "Referer": "https://motchillz.cx/"
                        },
                        subtitles: []
                    });
                }
            }
        }

        if (m3u8Link) {
            return JSON.stringify({
                url: m3u8Link,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Origin": "https://motchillz.cx",
                    "Referer": "https://motchillz.cx/"
                },
                subtitles: []
            });
        }

        // Fallback: trả URL gốc để WebView tự xử lý
        var videoUrl = (fallbackUrl && fallbackUrl.indexOf("http") === 0) ? fallbackUrl : "";
        return JSON.stringify({
            url: videoUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://motchillz.cx/"
            },
            subtitles: []
        });
    } catch (e) {
        return JSON.stringify({ url: "", headers: {}, subtitles: [] });
    }
}

// =============================================================================
// CATEGORY/COUNTRY/YEAR PARSERS
// =============================================================================

function parseCategoriesResponse(html) {
    var cats = [];
    var catRegex = /<a[^>]+href="\/the-loai\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    var m;
    while ((m = catRegex.exec(html)) !== null) {
        var slug = m[1];
        var name = PluginUtils.cleanText(m[2]);
        if (name && slug) {
            cats.push({ name: name, slug: slug });
        }
    }
    return JSON.stringify(cats);
}

function parseCountriesResponse(html) {
    var countries = [];
    var cRegex = /<a[^>]+href="\/quoc-gia\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    var m;
    while ((m = cRegex.exec(html)) !== null) {
        var val = m[1];
        var name = PluginUtils.cleanText(m[2]);
        if (name && val) {
            countries.push({ name: name, value: val });
        }
    }
    return JSON.stringify(countries);
}

function parseYearsResponse(html) {
    var years = [];
    var yRegex = /<a[^>]+href="\/nam-phat-hanh\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    var m;
    while ((m = yRegex.exec(html)) !== null) {
        var val = m[1];
        var name = PluginUtils.cleanText(m[2]);
        if (name && val) {
            years.push({ name: name, value: val });
        }
    }
    return JSON.stringify(years);
}
