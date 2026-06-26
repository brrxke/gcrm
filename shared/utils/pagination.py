from flask import request


def paginate(query, page=None, per_page=None, sort_key=None, sort_dir=-1):
    if page is None:
        page = request.args.get('page', 1, type=int)
    if per_page is None:
        per_page = request.args.get('per_page', 20, type=int)

    page = max(1, page)
    per_page = max(1, min(per_page, 100))

    total = query.count()

    if sort_key:
        query = query.sort(sort_key, sort_dir)

    items = query.skip((page - 1) * per_page).limit(per_page)

    return {
        'items': list(items),
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page,
    }
