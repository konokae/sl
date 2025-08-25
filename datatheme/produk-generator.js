
        let autoId = 1;
        async function fetchBlogspotData(feedUrl, isPost = true) {
          const response = await fetch(feedUrl);
          const data = await response.json();

          return data.feed.entry.map(entry =&gt; {
            const title = entry.title.$t;
            const url = entry.link.find(link =&gt; link.rel === &#39;alternate&#39;).href;
            const content = entry.content?.$t || &#39;&#39;;

            const categoryMatch = content.match(/<!--\s*Category:\s*(.*?)\s*-->/i);
            const category = categoryMatch ? categoryMatch[1].trim() : (entry.category?.[0]?.term || &#39;Uncategorized&#39;);

            const rawIdMatch = entry.id?.$t?.match(/(?:post|page)-(\d+)/);
            let customId = autoId++;
            if (rawIdMatch) {
              const originalId = rawIdMatch[1];
              const first2 = originalId.substring(0, 2);
              const last1 = originalId.slice(-1);
              customId = `${first2}${last1}`;
            }

            const labels = [category];
            return { title, url, labels, id: customId };
          });
        }

        function groupByCategory(data) {
          const categoryMap = {};
          data.forEach(item =&gt; {
            item.labels.forEach(label =&gt; {
              if (!categoryMap[label]) {
                categoryMap[label] = [];
              }
              categoryMap[label].push(item);
            });
          });
          return categoryMap;
        }

        function createLinkItem(link) {
          return `
            <a class='text-decoration-none d-block mb-2' href='${link.url}' target='_blank'>
              <div class='d-flex align-items-center p-3 rounded shadow-sm bg-white border-start border-4 border-primary'>
                <div class='fs-5 fw-bold text-muted'>${link.id}</div>
                <div class='flex-grow-1 px-3 fw-semibold'>${link.title}</div>
                <iconify-icon icon='mdi:tag' width='20'/>
              </div>
            </a>`;
        }

        function createCategorySection(category, links) {
          return `
            <div class='my-category'><i class='fa fa-th-large'/> ${category}</div>
            <div class='my-link-list'>
              ${links.slice(0,5).map(createLinkItem).join(&#39;&#39;)}
            </div>`;
        }

        async function renderContent() {
          const contentContainer = document.getElementById(&#39;my-content-container&#39;);
          const pagesData = await fetchBlogspotData(&#39;https://tikshoope.blogspot.com/feeds/pages/default?alt=json&amp;max-results=100&#39;);
          const postsData = await fetchBlogspotData(&#39;https://tikshoope.blogspot.com/feeds/posts/default?alt=json&amp;max-results=100&#39;);

          const combinedData = [...pagesData, ...postsData];
          const uniqueData = combinedData.filter((item, index, self) =&gt;
            index === self.findIndex(t =&gt; t.url === item.url)
          );

          const grouped = groupByCategory(uniqueData);
          const excludedCategories = [&#39;satu&#39;, &#39;LP&#39;, &#39;Uncategorized&#39;];

          const columns = [&#39;&#39;, &#39;&#39;, &#39;&#39;];
          let i = 0;
          for (const [category, links] of Object.entries(grouped)) {
            if (!excludedCategories.includes(category)) {
              columns[i % 3] += createCategorySection(category, links);
              i++;
            }
          }

          columns.forEach(column =&gt; {
            const columnDiv = document.createElement(&#39;div&#39;);
            columnDiv.className = &#39;my-column&#39;;
            columnDiv.innerHTML = column;
            contentContainer.appendChild(columnDiv);
          });
        }

        renderContent();

  
