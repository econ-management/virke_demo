import urllib.parse

def raw_url_conv(raw_url):
    parsed = urllib.parse.urlparse(raw_url)
    if parsed.password:
        # Reconstruct with properly encoded password
        encoded_password = urllib.parse.quote(parsed.password, safe='')
        netloc = f"{parsed.username}:{encoded_password}@{parsed.hostname}"
        if parsed.port:
            netloc += f":{parsed.port}"
        url = urllib.parse.urlunparse((
            parsed.scheme,
            netloc,
            parsed.path,
            parsed.params,
            parsed.query,
            parsed.fragment
        ))
    else:
        # No password or already properly formatted
        url = raw_url
    return url
